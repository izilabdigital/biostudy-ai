
-- Create storage bucket for PDF uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('study-pdfs', 'study-pdfs', true);

-- Storage policies - anyone can upload and read PDFs
CREATE POLICY "Anyone can upload PDFs" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'study-pdfs');
CREATE POLICY "Anyone can read PDFs" ON storage.objects FOR SELECT USING (bucket_id = 'study-pdfs');

-- Create table for custom study themes from PDFs
CREATE TABLE public.custom_study_areas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  icon TEXT NOT NULL DEFAULT '📄',
  color TEXT NOT NULL DEFAULT 'bg-blue-500',
  source_pdf_url TEXT,
  source_pdf_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.custom_study_areas ENABLE ROW LEVEL SECURITY;

-- Public access (no auth required for this app)
CREATE POLICY "Anyone can view custom areas" ON public.custom_study_areas FOR SELECT USING (true);
CREATE POLICY "Anyone can insert custom areas" ON public.custom_study_areas FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can delete custom areas" ON public.custom_study_areas FOR DELETE USING (true);
