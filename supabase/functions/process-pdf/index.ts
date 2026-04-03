import { corsHeaders } from '@supabase/supabase-js/cors'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const formData = await req.formData()
    const file = formData.get('pdf') as File
    if (!file) {
      return new Response(JSON.stringify({ error: 'No PDF file provided' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // Upload PDF to storage
    const fileName = `${Date.now()}-${file.name}`
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('study-pdfs')
      .upload(fileName, file, { contentType: 'application/pdf' })

    if (uploadError) {
      throw new Error(`Upload failed: ${uploadError.message}`)
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('study-pdfs')
      .getPublicUrl(fileName)

    const pdfUrl = urlData.publicUrl

    // Send URL to n8n webhook for AI analysis
    const webhookUrl = 'https://n8n-n8n.xwskpb.easypanel.host/webhook/biomed-site-app'
    const webhookResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'analyze_pdf',
        pdf_url: pdfUrl,
        pdf_name: file.name,
      }),
    })

    if (!webhookResponse.ok) {
      throw new Error(`Webhook error: ${webhookResponse.status}`)
    }

    const themes = await webhookResponse.json()

    // Save themes to database
    if (Array.isArray(themes) && themes.length > 0) {
      const rows = themes.map((t: any) => ({
        name: t.name ?? t.nome ?? 'Tema sem nome',
        description: t.description ?? t.descricao ?? '',
        icon: t.icon ?? t.icone ?? '📄',
        color: t.color ?? t.cor ?? 'bg-blue-500',
        source_pdf_url: pdfUrl,
        source_pdf_name: file.name,
      }))

      const { error: insertError } = await supabase
        .from('custom_study_areas')
        .insert(rows)

      if (insertError) {
        throw new Error(`Insert failed: ${insertError.message}`)
      }

      return new Response(JSON.stringify({ success: true, themes: rows }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ success: false, error: 'No themes returned from AI' }), {
      status: 422,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
