import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const {
      creatorName,
      creatorSpecialty,
      creatorBio,
      creatorLinkedIn,
      discipline,
      nominatorEmail,
      whyNominate,
    } = await request.json()

    // Validate required fields
    if (!creatorName?.trim()) {
      return NextResponse.json(
        { error: 'El nombre del creador es requerido' },
        { status: 400 }
      )
    }

    if (!creatorSpecialty?.trim()) {
      return NextResponse.json(
        { error: 'La especialidad es requerida' },
        { status: 400 }
      )
    }

    if (!discipline?.trim()) {
      return NextResponse.json(
        { error: 'La disciplina es requerida' },
        { status: 400 }
      )
    }

    if (!nominatorEmail?.trim()) {
      return NextResponse.json(
        { error: 'Tu email es requerido' },
        { status: 400 }
      )
    }

    if (!whyNominate?.trim()) {
      return NextResponse.json(
        { error: 'Debes explicar por qué lo recomiendas' },
        { status: 400 }
      )
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(nominatorEmail)) {
      return NextResponse.json(
        { error: 'El email no es válido' },
        { status: 400 }
      )
    }

    const supabase = createServiceClient()

    const { data, error } = await supabase
      .from('sala_creator_nominations')
      .insert({
        creator_name: creatorName.trim(),
        creator_specialty: creatorSpecialty.trim(),
        creator_bio: creatorBio?.trim() || null,
        creator_linkedin: creatorLinkedIn?.trim() || null,
        discipline_id: discipline.trim(),
        nominator_email: nominatorEmail.trim(),
        why_nominate: whyNominate.trim(),
        status: 'pending',
      })
      .select()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Error al guardar la nominación' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Nominación enviada correctamente',
      id: data?.[0]?.id,
    })
  } catch (error) {
    console.error('Nomination API error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
