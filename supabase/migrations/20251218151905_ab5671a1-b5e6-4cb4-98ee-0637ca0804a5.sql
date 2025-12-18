-- Add UPDATE and DELETE policies for the predictions table
-- This fixes the missing RLS policies issue

-- Add UPDATE policy for authenticated users
CREATE POLICY "Authenticated users can update predictions"
ON public.predictions
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Add DELETE policy for authenticated users
CREATE POLICY "Authenticated users can delete predictions"
ON public.predictions
FOR DELETE
TO authenticated
USING (true);