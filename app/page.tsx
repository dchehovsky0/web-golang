// 'use client'
// import { useEffect, useState } from 'react'

// export default function Page() {
//   const [events, setEvents] = useState<any[]>([])

//   useEffect(() => {
//     const ws = new WebSocket('ws://localhost:8080/ws')
//     ws.onmessage = (m) => {
//       const ev = JSON.parse(m.data)
//       setEvents((prev) => [ev, ...prev.slice(0, 199)])
//     }
//     return () => ws.close()
//   }, [])

//   return (
//     <main>
//       <h1>Live Token Events</h1>
//       <ul>
//         {events.map((ev, i) => (
//           <li key={i}>
//             <b>{ev.symbol}</b> — {ev.name}
//           </li>
//         ))}
//       </ul>
//     </main>
//   )
// }

"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { mapEventToTokenData } from "@/utils/transform"
import { TokenData } from "@/types/token"
import { useTokenStream } from '@/hooks/useTokenStream'
import { Rocket, Settings, X, Check, Star } from "lucide-react" // Импортируем Star
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Badge from "@/components/ui/badge" // Исправлен импорт Badge
import { FilterModal } from "./components/filter-modal"
import { CommentModal } from "@/components/comment-modal" // Импортируем новый компонент
import { useToast } from "@/hooks/use-toast"

interface RelatedToken {
  ticker: string
  name: string
  timeAgo: string
  value: string
  migrated?: boolean // Добавляем поле для статуса миграции
}

export default function TokenHunter() {
  const rawTokens = useTokenStream()
  const tokens = rawTokens.map(mapEventToTokenData)
  const [autoBuy, setAutoBuy] = useState(true)
  const [openInAxiom, setOpenInAxiom] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [openInTwitter, setOpenInTwitter] = useState(false)
  const [hiddenTokens, setHiddenTokens] = useState<number[]>([])
  // Изменено на Record<string, string> для хранения комментариев
  const [favoritedSources, setFavoritedSources] = useState<Record<string, string>>({})
  const [showCommentModal, setShowCommentModal] = useState(false)
  const [tokenToComment, setTokenToComment] = useState<TokenData | null>(null) // Токен, для которого открывается модалка
  const { toast } = useToast()

  const hideToken = (index: number) => {
    setHiddenTokens((prev) => [...prev, index])
  }

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address).then(() => {
      toast({
        title: "Скопировано!",
        description: "Адрес контракта скопирован в буфер обмена.",
      })
    })
  }

  const handleRemoveAll = () => {
    setHiddenTokens(Array.from({ length: tokens.length }, (_, i) => i))
  }

  // Открывает модальное окно для комментария
  const handleRememberTokenClick = (token: TokenData) => {
    setTokenToComment(token)
    setShowCommentModal(true)
  }

  // Сохраняет комментарий и обновляет favoritedSources
  const handleSaveComment = (address: string, comment: string) => {
    setFavoritedSources((prev) => {
      const newState = { ...prev }
      newState[address] = comment.trim() // Сохраняем пустую строку, если комментарий пуст
      return newState
    })
    // Уточненное уведомление
    toast({
      title: "Запомнено!",
      description:
        comment.trim() !== ""
          ? `Токен ${tokenToComment?.symbol} добавлен в избранное с комментарием.`
          : `Токен ${tokenToComment?.symbol} добавлен в избранное без комментария.`,
    })
    setShowCommentModal(false)
    setTokenToComment(null) // Сбрасываем токен после сохранения
  }

  // Новая функция для "добавить в черный список"
  const handleAddTokenToBlacklist = (tokenSymbol: string) => {
    toast({
      title: "В черный список!",
      description: `Токен ${tokenSymbol} добавлен в черный список.`,
      variant: "destructive",
    })
    // Здесь можно добавить логику для добавления токена в черный список
  }

  // Новая функция для удаления из избранного и удаления комментария
  const handleRemoveFromFavorites = (token: TokenData) => {
    setFavoritedSources((prev) => {
      const newState = { ...prev }
      delete newState[token.address] // Удаляем из избранного
      return newState
    })
    toast({
      title: "Удалено из избранного!",
      description: `Токен ${token.symbol} удален из избранного, комментарий очищен.`,
    })
    setTokenToComment(null) // Сбрасываем токен
    setShowCommentModal(false) // Закрываем модальное окно, если оно было открыто
  }

  const SwipeableCard = ({
    children,
    onSwipeLeft,
    index,
  }: { children: React.ReactNode; onSwipeLeft: (index: number) => void; index: number }) => {
    const [isDragging, setIsDragging] = useState(false)
    const [startX, setStartX] = useState(0)
    const [translateX, setTranslateX] = useState(0)
    const cardRef = useRef<HTMLDivElement>(null)

    const handlePointerDown = (e: React.PointerEvent) => {
      setIsDragging(true)
      setStartX(e.clientX)
      setTranslateX(0)
      if (cardRef.current) {
        cardRef.current.style.transition = "none"
      }
    }

    const handlePointerMove = (e: React.PointerEvent) => {
      if (!isDragging) return
      const diffX = e.clientX - startX
      if (diffX < 0) {
        setTranslateX(diffX)
      }
    }

    const handlePointerUp = () => {
      setIsDragging(false)
      if (cardRef.current) {
        cardRef.current.style.transition = "transform 0.3s ease-out"
      }

      const swipeThreshold = cardRef.current ? -cardRef.current.offsetWidth / 3 : -100
      if (translateX < swipeThreshold) {
        setTranslateX(-(cardRef.current ? cardRef.current.offsetWidth : 500))
        setTimeout(() => {
          onSwipeLeft(index)
        }, 300)
      } else {
        setTranslateX(0)
      }
    }

    return (
      <div
        ref={cardRef}
        className="relative transition-transform duration-300 ease-out"
        style={{ transform: `translateX(${translateX}px)` }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={() => {
          if (isDragging) handlePointerUp()
        }}
      >
        {children}
      </div>
    )
  }

  const getTypeBadgeContent = (type: "Dev Migrations" | "Average Mcap" | "Community") => {
    switch (type) {
      case "Dev Migrations":
        return <>👑 Dev Migrations</>
      case "Average Mcap":
        return <>⚡ Average Mcap</>
      case "Community":
        return <>📣 Community</>
      default:
        return type
    }
  }

  const getTypeBadgeClass = (type: "Dev Migrations" | "Average Mcap" | "Community") => {
    switch (type) {
      case "Dev Migrations":
        return "bg-red-500 text-white"
      case "Average Mcap":
        return "bg-yellow-500 text-gray-900"
      case "Community":
        return "bg-blue-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col">
      <div className="w-full max-w-xl mx-auto bg-gray-800 h-full flex flex-col relative">
        {/* Header - статичный */}
        <div className="flex items-center justify-between p-4 border-b border-gray-600 flex-shrink-0">
          {/* Блок с ракетой и названием, теперь кликабельный */}
          <button
            className="flex items-center gap-2 text-white hover:text-cyan-400 transition-colors duration-200"
            onClick={handleRemoveAll}
            aria-label="Скрыть все карточки"
          >
            <Rocket className="w-5 h-5 text-cyan-400" />
            <span className="font-semibold text-lg">Token Hunter</span>
          </button>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 text-gray-400 hover:text-white hover:bg-gray-600"
              onClick={() => setShowFilters(true)}
            >
              <Settings className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="w-8 h-8 text-gray-400 hover:text-white hover:bg-gray-600">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Token List - скроллируемая область */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {tokens.map(
            (token, index) =>
              !hiddenTokens.includes(index) && (
                <SwipeableCard key={index} onSwipeLeft={hideToken} index={index}>
                  <Card className="bg-gray-700 border-gray-600 p-4 relative hover:border-green-500 hover:shadow-lg hover:shadow-green-500/20 transition-all duration-200 group flex-1">
                    {/* Типы карточки в левом верхнем углу */}
                    <div className="absolute top-4 left-4 flex gap-1">
                      {token.type.map((t) => (
                        <Badge key={t} className={`${getTypeBadgeClass(t)} text-xs font-medium px-2 py-1 rounded-md`}>
                          {getTypeBadgeContent(t)}
                        </Badge>
                      ))}
                    </div>

                    {/* Иконки "запомнить" и "черный список" в правом верхнем углу */}
                    <div className="absolute top-4 right-4 flex items-center gap-1">
                      {/* Иконка избранного, если источник добавлен в избранное */}
                      {token.address in favoritedSources && ( // Изменено условие
                        <Star className="w-4 h-4 text-yellow-400 mr-1" />
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-6 h-6 text-gray-400 hover:text-green-500 hover:bg-gray-600"
                        onClick={() => handleRememberTokenClick(token)} // Изменено на новую функцию
                        title={token.address in favoritedSources ? "Редактировать комментарий" : "Запомнить токен"} // Изменено условие
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-6 h-6 text-gray-400 hover:text-red-500 hover:bg-gray-600"
                        onClick={() =>
                          token.address in favoritedSources // Изменено условие
                            ? handleRemoveFromFavorites(token) // Изменено: теперь просто удаляет из избранного
                            : handleAddTokenToBlacklist(token.symbol)
                        }
                        title={
                          token.address in favoritedSources // Изменено условие
                            ? "Удалить из избранного" // Изменена подсказка
                            : "Добавить в черный список"
                        }
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="flex flex-col items-center justify-center mb-3 pt-10">
                      {/* Копируемый адрес контракта */}
                      <button
                        onClick={() => handleCopyAddress(token.address)}
                        className="text-xs text-gray-400 hover:text-white cursor-pointer mb-1"
                        title="Нажмите, чтобы скопировать"
                      >
                        {token.address}
                      </button>
                      {/* Объединенные символ и название */}
                      <div className="text-sm text-gray-300">
                        <span className="font-semibold text-white">{token.symbol}</span> / {token.name}
                      </div>
                    </div>

                    {/* Условный рендеринг содержимого карточки */}
                    {token.type.includes("Dev Migrations") ? (
                      // Контент для Dev Migrations (с кружками миграции)
                      <>
                        <div className="space-y-2 text-sm mt-4">
                          {token.relatedTokens?.map((related, idx) => (
                            <div key={idx} className="flex items-center text-gray-300">
                              <div
                                className={`w-3 h-2 rounded-full mr-1 ${related.migrated ? "bg-green-500" : "bg-red-500"}`}
                              />
                              <span>
                                <span className="font-semibold text-white">{related.ticker}</span> / {related.name}{" "}
                                <span className="text-gray-400">
                                  {related.timeAgo}{" "}
                                  <span className="font-semibold text-orange-400">{related.value}</span>
                                </span>
                              </span>
                            </div>
                          ))}
                        </div>
                        {/* Комментарий для Dev Migrations */}
                        {favoritedSources[token.address] && (
                          <p className="text-sm italic text-gray-300 mt-3 mb-3 text-center max-w-[90%] mx-auto">
                            {favoritedSources[token.address]}
                          </p>
                        )}
                      </>
                    ) : token.type.includes("Average Mcap") ? (
                      // Контент для Average Mcap (без кружков миграции)
                      <>
                        <div className="space-y-2 text-sm mt-4">
                          {token.relatedTokens?.map((related, idx) => (
                            <div key={idx} className="flex items-center text-gray-300">
                              <span>
                                <span className="font-semibold text-white">{related.ticker}</span> / {related.name}{" "}
                                <span className="text-gray-400">
                                  {related.timeAgo}{" "}
                                  <span className="font-semibold text-orange-400">{related.value}</span>
                                </span>
                              </span>
                            </div>
                          ))}
                        </div>
                        {/* Комментарий для Average Mcap */}
                        {favoritedSources[token.address] && (
                          <p className="text-sm italic text-gray-300 mt-3 mb-3 text-center max-w-[90%] mx-auto">
                            {favoritedSources[token.address]}
                          </p>
                        )}
                      </>
                    ) : token.type.includes("Community") ? (
                      // Контент для Community
                      <div className="space-y-1 text-sm mt-4">
                        {" "}
                        {/* Изменено с space-y-2 на space-y-1 */}
                        <div className="flex justify-between">
                          <span className="text-gray-400">Average Mcap:</span>
                          <span className="font-semibold text-white">{token.communityAverageMcap}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Last Mcap:</span>
                          <span className="font-semibold text-white">{token.communityLastMcap}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Total:</span>
                          <span className="font-semibold text-white">{token.communityTotal}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">TweetScout:</span>
                          <span className="font-semibold text-cyan-400">{token.communityTweetScoutValue}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">AlphaGate:</span>
                          <span className="font-semibold text-green-400">{token.communityAlphaGateValue} ключей</span>
                        </div>
                        {/* Отображение комментария, если он есть - ПЕРЕМЕЩЕНО СЮДА */}
                        {favoritedSources[token.address] && (
                          <p className="text-sm italic text-gray-300 mt-3 mb-3 text-center max-w-[90%] mx-auto">
                            {favoritedSources[token.address]}
                          </p>
                        )}
                        <div className="flex items-center justify-center gap-2 mt-3 mb-3">
                          <Button variant="link" className="text-cyan-400 p-0 h-auto text-sm hover:text-cyan-300">
                            🌐 {token.communityLink}
                          </Button>
                          <Button variant="link" className="text-cyan-400 p-0 h-auto text-sm hover:text-cyan-300">
                            🐦 {token.twitterHandle}
                          </Button>
                        </div>
                      </div>
                    ) : null}

                    <div className="flex gap-2 mt-3">
                      <Button className="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium">
                        👁‍🗨 Axiom
                      </Button>
                      <Button className="flex-1 bg-purple-500 hover:bg-purple-600 text-white font-medium">
                        🌸 Bloom
                      </Button>
                    </div>
                  </Card>
                </SwipeableCard>
              ),
          )}
        </div>

        {/* Footer - статичный */}
        <div className="bg-gray-800 border-t border-gray-600 p-4 flex-shrink-0">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <span className="text-gray-400">
                Всего: <span className="text-white">{tokens.length - hiddenTokens.length}</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full" />
              <span className="text-green-400">Онлайн</span>
            </div>
          </div>
        </div>

        {/* Filter Modal */}
        <FilterModal
          open={showFilters}
          onOpenChange={setShowFilters}
          autoBuy={autoBuy}
          setAutoBuy={setAutoBuy}
          openInAxiom={openInAxiom}
          setOpenInAxiom={setOpenInAxiom}
          openInTwitter={openInTwitter}
          setOpenInTwitter={setOpenInTwitter}
        />

        {/* Comment Modal */}
        {tokenToComment && (
          <CommentModal
            open={showCommentModal}
            onOpenChange={setShowCommentModal}
            tokenAddress={tokenToComment.address}
            initialComment={favoritedSources[tokenToComment.address] || ""}
            onSave={handleSaveComment}
          />
        )}
      </div>
    </div>
  )
}

