"use client"

import { useState } from "react"
import { createClient } from "@supabase/supabase-js"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { cn } from "@/lib/utils"

// ⚠️ Usa variables de entorno en producción
const supabase = createClient(
  "https://vhwiulmxearyubixrwep.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZod2l1bG14ZWFyeXViaXhyd2VwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExMDY0MTcsImV4cCI6MjA3NjY4MjQxN30.IDT03d0XUbhJQJrmtZfvoo1jViBAOhkaJ6nLSbwWN64"
)

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setMessage("")
    setLoading(true)

    try {
      // 🔎 Verificar si el correo ya existe en la tabla
      const { data: existingUser, error: queryError } = await supabase
        .from("usuarios")
        .select("email")
        .eq("email", email)
        .maybeSingle()

      if (queryError) throw queryError

      if (existingUser) {
        setMessage("⚠️ Este correo ya está registrado.")
        setLoading(false)
        return
      }

      // 📨 Insertar nuevo registro
      const { error: insertError } = await supabase
        .from("usuarios")
        .insert([{ email }]) // 👈 IMPORTANTE: usa array para evitar advertencias tipadas

      if (insertError) throw insertError

      setMessage("✅ Registro completado correctamente.")
      setEmail("")
    } catch (err) {
      // 👇 sin tipado 'any' para evitar error de TypeScript
      console.error("Error registrando usuario:", err)
      setMessage("❌ Error registrando el correo.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleRegister} className={cn("flex flex-col gap-6")}>
      <FieldGroup>
        <div className="text-center">
          <h1 className="text-2xl font-bold">Registro con correo electrónico</h1>
          <p className="text-sm text-muted-foreground">
            Ingresa tu correo para registrarte en la base de datos.
          </p>
        </div>

        <Field>
          <FieldLabel htmlFor="email">Correo electrónico</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="ejemplo@correo.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>

        <Button type="submit" disabled={loading}>
          {loading ? "Registrando..." : "Registrar"}
        </Button>

        {message && (
          <p
            className={cn(
              "text-sm mt-2 text-center",
              message.startsWith("✅")
                ? "text-green-500"
                : message.startsWith("⚠️")
                ? "text-yellow-500"
                : "text-red-500"
            )}
          >
            {message}
          </p>
        )}
      </FieldGroup>
    </form>
  )
}
