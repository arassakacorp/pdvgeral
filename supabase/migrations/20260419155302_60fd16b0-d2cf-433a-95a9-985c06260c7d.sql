DROP POLICY IF EXISTS "Logados podem editar produtos" ON public.produtos;
DROP POLICY IF EXISTS "Logados podem excluir produtos" ON public.produtos;

CREATE POLICY "Donos podem editar produtos"
ON public.produtos
FOR UPDATE
TO authenticated
USING (auth.uid() = created_by)
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Donos podem excluir produtos"
ON public.produtos
FOR DELETE
TO authenticated
USING (auth.uid() = created_by);