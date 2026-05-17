import { describe, it, expect } from 'vitest'
import crypto from 'crypto'
import {
  PLATFORM_FEE_CLP,
  buildEventId,
  validatePlatformAmount,
  parseRef,
  parsePlatformRef,
  safeStringEq,
  verifyMPSignaturePure,
} from '@/lib/payments/mp-helpers'

// ─────────────────────────────────────────────────────────────────────────────
// FIX C1 — buildEventId: webhooks distintos del MISMO recurso deben ser únicos
// ─────────────────────────────────────────────────────────────────────────────
describe('FIX C1 — idempotencia: buildEventId distingue request-id', () => {
  it('produce IDs distintos para mismo type+dataId si request-id difiere', () => {
    // Escenario real: MP envía payment.created y luego payment.approved con el
    // mismo data.id (=payment id), pero distinto x-request-id (uno por request).
    const created = buildEventId('payment', '123', undefined, 'req-AAA')
    const approved = buildEventId('payment', '123', undefined, 'req-BBB')
    expect(created).not.toBe(approved)
  })

  it('produce IDs IGUALES si exactamente el mismo webhook se entrega 2 veces', () => {
    // Mismo request-id = MP reintentó el mismo evento → debe deduplicarse
    const a = buildEventId('payment', '123', undefined, 'req-XXX')
    const b = buildEventId('payment', '123', undefined, 'req-XXX')
    expect(a).toBe(b)
  })

  it('tolera ausencia de request-id sin colisionar todo a "unknown"', () => {
    const a = buildEventId('payment', '111', undefined, '')
    const b = buildEventId('payment', '222', undefined, '')
    expect(a).not.toBe(b)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// FIX C5 — validatePlatformAmount: tolerancia estricta ±1%
// ─────────────────────────────────────────────────────────────────────────────
describe('FIX C5 — validatePlatformAmount tolerancia ±1%', () => {
  it('acepta el monto exacto', () => {
    expect(validatePlatformAmount(PLATFORM_FEE_CLP)).toBe(true)
  })

  it('acepta dentro de ±1% (redondeo del procesador)', () => {
    expect(validatePlatformAmount(PLATFORM_FEE_CLP + 100)).toBe(true)
    expect(validatePlatformAmount(PLATFORM_FEE_CLP - 100)).toBe(true)
  })

  it('RECHAZA montos que el código viejo aceptaba (rango 28000-32000)', () => {
    // El bug viejo aceptaba 28000 como válido. Ahora debe rechazar.
    expect(validatePlatformAmount(28000)).toBe(false)
    expect(validatePlatformAmount(32000)).toBe(false)
    expect(validatePlatformAmount(29000)).toBe(false)
    expect(validatePlatformAmount(30500)).toBe(false)
  })

  it('rechaza montos manifiestamente fuera de rango', () => {
    expect(validatePlatformAmount(0)).toBe(false)
    expect(validatePlatformAmount(1)).toBe(false)
    expect(validatePlatformAmount(100000)).toBe(false)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// parseRef — input validation contra UUIDs inválidos y self-subscription
// ─────────────────────────────────────────────────────────────────────────────
describe('parseRef validación de external_reference', () => {
  const UID_A = '11111111-2222-3333-4444-555555555555'
  const UID_B = 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee'

  it('parsea ref válido', () => {
    const r = parseRef(`${UID_A}:${UID_B}:10000`)
    expect(r).toEqual({ subscriberId: UID_A, creatorId: UID_B, priceCLP: 10000 })
  })

  it('rechaza UUIDs inválidos', () => {
    expect(parseRef(`not-a-uuid:${UID_B}:10000`)).toBeNull()
    expect(parseRef(`${UID_A}:not-a-uuid:10000`)).toBeNull()
  })

  it('rechaza subscriber === creator (auto-suscripción)', () => {
    expect(parseRef(`${UID_A}:${UID_A}:10000`)).toBeNull()
  })

  it('rechaza precio inválido', () => {
    expect(parseRef(`${UID_A}:${UID_B}:0`)).toBeNull()
    expect(parseRef(`${UID_A}:${UID_B}:-100`)).toBeNull()
    expect(parseRef(`${UID_A}:${UID_B}:abc`)).toBeNull()
  })

  it('rechaza ref con prefijo platform: (debe ir por parsePlatformRef)', () => {
    expect(parseRef(`platform:${UID_A}:${UID_B}`)).toBeNull()
  })
})

describe('parsePlatformRef', () => {
  const UID_A = '11111111-2222-3333-4444-555555555555'
  const UID_B = 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee'

  it('parsea ref platform válido', () => {
    expect(parsePlatformRef(`platform:${UID_A}:${UID_B}`)).toEqual({
      creatorId: UID_A,
      userId: UID_B,
    })
  })

  it('rechaza sin prefijo platform:', () => {
    expect(parsePlatformRef(`${UID_A}:${UID_B}:10000`)).toBeNull()
  })

  it('rechaza UUIDs inválidos', () => {
    expect(parsePlatformRef(`platform:foo:${UID_B}`)).toBeNull()
    expect(parsePlatformRef(`platform:${UID_A}:bar`)).toBeNull()
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// FIX C3 — safeStringEq: comparación constant-time
// ─────────────────────────────────────────────────────────────────────────────
describe('FIX C3 — safeStringEq (anti timing attack en state CSRF)', () => {
  it('strings iguales → true', () => {
    expect(safeStringEq('abc123', 'abc123')).toBe(true)
  })

  it('strings distintos → false', () => {
    expect(safeStringEq('abc123', 'abc124')).toBe(false)
    expect(safeStringEq('abc', 'xyz')).toBe(false)
  })

  it('longitudes distintas → false sin loop (early return)', () => {
    expect(safeStringEq('abc', 'abcd')).toBe(false)
  })

  it('strings vacíos iguales', () => {
    expect(safeStringEq('', '')).toBe(true)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// FIX C7 — verifyMPSignaturePure no crashea con hash de longitud incorrecta
// ─────────────────────────────────────────────────────────────────────────────
describe('FIX C7 — verifyMPSignaturePure rechaza firmas malformadas sin lanzar', () => {
  const SECRET = 'test-webhook-secret'
  const REQUEST_ID = 'req-abc'
  const DATA_ID = '12345'
  const NOW = 1779000000
  const TS = String(NOW)

  // Helper para generar una firma válida
  function validSig(): string {
    const manifest = `id:${DATA_ID};request-id:${REQUEST_ID};ts:${TS};`
    const hash = crypto.createHmac('sha256', SECRET).update(manifest).digest('hex')
    return `ts=${TS},v1=${hash}`
  }

  it('acepta firma correcta', () => {
    expect(
      verifyMPSignaturePure({
        signatureHeader: validSig(),
        requestId: REQUEST_ID,
        dataId: DATA_ID,
        secret: SECRET,
        nowSec: NOW,
      })
    ).toBe(true)
  })

  it('rechaza hash de 8 chars (caso que provocaba 500 antes del fix)', () => {
    expect(() =>
      verifyMPSignaturePure({
        signatureHeader: `ts=${TS},v1=deadbeef`,
        requestId: REQUEST_ID,
        dataId: DATA_ID,
        secret: SECRET,
        nowSec: NOW,
      })
    ).not.toThrow()

    expect(
      verifyMPSignaturePure({
        signatureHeader: `ts=${TS},v1=deadbeef`,
        requestId: REQUEST_ID,
        dataId: DATA_ID,
        secret: SECRET,
        nowSec: NOW,
      })
    ).toBe(false)
  })

  it('rechaza hash de 63 chars (off-by-one)', () => {
    const short = 'a'.repeat(63)
    expect(
      verifyMPSignaturePure({
        signatureHeader: `ts=${TS},v1=${short}`,
        requestId: REQUEST_ID,
        dataId: DATA_ID,
        secret: SECRET,
        nowSec: NOW,
      })
    ).toBe(false)
  })

  it('rechaza header sin ts/v1', () => {
    expect(verifyMPSignaturePure({ signatureHeader: '', requestId: 'x', dataId: 'y', secret: SECRET, nowSec: NOW })).toBe(false)
    expect(verifyMPSignaturePure({ signatureHeader: 'garbage', requestId: 'x', dataId: 'y', secret: SECRET, nowSec: NOW })).toBe(false)
  })

  it('rechaza ts fuera de ventana ±5 min (replay attack)', () => {
    const oldSig = validSig()
    expect(
      verifyMPSignaturePure({
        signatureHeader: oldSig,
        requestId: REQUEST_ID,
        dataId: DATA_ID,
        secret: SECRET,
        nowSec: NOW + 400, // 6.6 min después
      })
    ).toBe(false)
  })

  it('rechaza si secret es incorrecto', () => {
    expect(
      verifyMPSignaturePure({
        signatureHeader: validSig(),
        requestId: REQUEST_ID,
        dataId: DATA_ID,
        secret: 'wrong-secret',
        nowSec: NOW,
      })
    ).toBe(false)
  })

  it('rechaza si dataId no coincide con el del manifest firmado', () => {
    expect(
      verifyMPSignaturePure({
        signatureHeader: validSig(),
        requestId: REQUEST_ID,
        dataId: 'tampered-id',
        secret: SECRET,
        nowSec: NOW,
      })
    ).toBe(false)
  })
})
