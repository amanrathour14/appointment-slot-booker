"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, CheckCircle, XCircle, Settings, User, Calendar } from "lucide-react"

interface TimeSlot {
  time: string
  isBooked: boolean
}

export default function AppointmentBooker() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [bookedSlots, setBookedSlots] = useState<Set<string>>(new Set())
  const [confirmationMessage, setConfirmationMessage] = useState<string>("")
  const [adminTime, setAdminTime] = useState<string>("")

  const workingHours = {
    start: 9,
    end: 17,
  }

  const formatDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }
    return date.toLocaleDateString("en-US", options)
  }

  const formatDateForInput = (date: Date): string => {
    return date.toISOString().split("T")[0]
  }

  const generateTimeSlots = (): TimeSlot[] => {
    const slots: TimeSlot[] = []
    for (let hour = workingHours.start; hour < workingHours.end; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
        slots.push({
          time: timeString,
          isBooked: bookedSlots.has(timeString),
        })
      }
    }
    return slots
  }

  const formatDisplayTime = (time: string): string => {
    const [hour, minute] = time.split(":")
    const hourNum = Number.parseInt(hour)
    const ampm = hourNum >= 12 ? "PM" : "AM"
    const displayHour = hourNum > 12 ? hourNum - 12 : hourNum === 0 ? 12 : hourNum
    return `${displayHour}:${minute} ${ampm}`
  }

  const handleSlotClick = (time: string) => {
    if (bookedSlots.has(time)) {
      return
    }

    const newBookedSlots = new Set(bookedSlots)
    newBookedSlots.add(time)
    setBookedSlots(newBookedSlots)

    const displayTime = formatDisplayTime(time)
    setConfirmationMessage(`Appointment booked for ${displayTime}!`)

    setTimeout(() => {
      setConfirmationMessage("")
    }, 4000)
  }

  const handleDateChange = (dateString: string) => {
    const date = new Date(dateString)
    setSelectedDate(date)
    setBookedSlots(new Set())
    setConfirmationMessage("")
  }

  const isValidTimeFormat = (time: string): boolean => {
    return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time)
  }

  const isWithinWorkingHours = (time: string): boolean => {
    const [hour] = time.split(":")
    const hourNum = Number.parseInt(hour)
    return hourNum >= workingHours.start && hourNum < workingHours.end
  }

  const handleAdminBooking = () => {
    if (!adminTime) return

    if (!isValidTimeFormat(adminTime)) {
      setConfirmationMessage("Please enter time in HH:MM format (e.g., 14:00)")
      setTimeout(() => setConfirmationMessage(""), 3000)
      return
    }

    if (!isWithinWorkingHours(adminTime)) {
      setConfirmationMessage("Time must be within working hours (9:00 AM - 5:00 PM)")
      setTimeout(() => setConfirmationMessage(""), 3000)
      return
    }

    if (bookedSlots.has(adminTime)) {
      setConfirmationMessage("This time slot is already booked")
      setTimeout(() => setConfirmationMessage(""), 3000)
      return
    }

    const newBookedSlots = new Set(bookedSlots)
    newBookedSlots.add(adminTime)
    setBookedSlots(newBookedSlots)
    setConfirmationMessage(`Admin booking added for ${formatDisplayTime(adminTime)}`)
    setAdminTime("")

    setTimeout(() => {
      setConfirmationMessage("")
    }, 4000)
  }

  const timeSlots = generateTimeSlots()
  const availableSlots = timeSlots.filter((slot) => !slot.isBooked).length
  const bookedSlotsCount = timeSlots.filter((slot) => slot.isBooked).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-4 py-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-lg">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Appointment Booking System
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Book your 30-minute appointment slots with ease. Select your preferred date and time from available slots.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <User className="w-6 h-6" />
                  Professional Schedule
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="flex flex-col lg:flex-row gap-6 items-start">
                  <div className="space-y-3 flex-1">
                    <Label className="text-base font-semibold text-gray-700">Select Date</Label>
                    <div className="space-y-2">
                      <Input
                        type="date"
                        value={formatDateForInput(selectedDate)}
                        onChange={(e) => handleDateChange(e.target.value)}
                        className="w-full lg:w-[320px] border-2 border-blue-200 focus:border-blue-400 bg-white text-base p-3"
                        min={formatDateForInput(new Date())}
                      />
                      <p className="text-sm text-gray-600 font-medium">Selected: {formatDate(selectedDate)}</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200 flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-5 h-5 text-green-600" />
                      <p className="font-semibold text-green-800">Working Hours</p>
                    </div>
                    <p className="text-green-700 font-medium">Available from 9:00 AM to 5:00 PM</p>
                    <p className="text-sm text-green-600 mt-1">30-minute appointment slots</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 justify-center">
                  <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-full">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-green-700 font-medium">{availableSlots} Available</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-full">
                    <XCircle className="w-4 h-4 text-red-600" />
                    <span className="text-red-700 font-medium">{bookedSlotsCount} Booked</span>
                  </div>
                </div>

                {confirmationMessage && (
                  <div
                    className={`rounded-xl p-4 shadow-lg transition-all duration-300 ${
                      confirmationMessage.includes("booked for") || confirmationMessage.includes("Admin booking")
                        ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                        : "bg-gradient-to-r from-red-500 to-pink-500 text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {confirmationMessage.includes("booked for") || confirmationMessage.includes("Admin booking") ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <XCircle className="w-6 h-6" />
                      )}
                      <span className="font-semibold text-lg">{confirmationMessage}</span>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    Available Time Slots
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
                    {timeSlots.map((slot) => (
                      <Button
                        key={slot.time}
                        variant={slot.isBooked ? "secondary" : "outline"}
                        className={`h-16 text-sm font-semibold transition-all duration-200 ${
                          slot.isBooked
                            ? "bg-red-100 text-red-600 border-red-200 cursor-not-allowed hover:bg-red-100 opacity-60"
                            : "bg-white border-2 border-blue-200 text-blue-700 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:text-white hover:border-transparent hover:shadow-lg hover:scale-105"
                        }`}
                        onClick={() => handleSlotClick(slot.time)}
                        disabled={slot.isBooked}
                      >
                        <div className="flex flex-col items-center gap-1">
                          <span className="font-bold">{formatDisplayTime(slot.time)}</span>
                          {slot.isBooked && <span className="text-xs opacity-75">Booked</span>}
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Admin Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-3">
                  <Label htmlFor="admin-time" className="text-base font-semibold text-gray-700">
                    Pre-book Time Slot
                  </Label>
                  <Input
                    id="admin-time"
                    type="text"
                    placeholder="14:00"
                    value={adminTime}
                    onChange={(e) => setAdminTime(e.target.value)}
                    className="border-2 border-orange-200 focus:border-orange-400 bg-white"
                  />
                  <Button
                    onClick={handleAdminBooking}
                    disabled={!adminTime}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-2 transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Book Slot
                  </Button>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                  <p className="text-sm text-orange-800">
                    <strong>Format:</strong> Use HH:MM format (e.g., 14:00 for 2:00 PM)
                  </p>
                  <p className="text-xs text-orange-600 mt-1">
                    This helps in setting up initial state for testing purposes.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                <CardTitle className="text-lg">Booking Instructions</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-3">
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full mt-1 flex-shrink-0"></div>
                    <p>
                      <strong>Available slots:</strong> Click any available slot to book your appointment
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full mt-1 flex-shrink-0"></div>
                    <p>
                      <strong>Booked slots:</strong> Red slots are already taken and cannot be selected
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mt-1 flex-shrink-0"></div>
                    <p>
                      <strong>Date selection:</strong> Choose a different date to see new available slots
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 bg-orange-500 rounded-full mt-1 flex-shrink-0"></div>
                    <p>
                      <strong>Confirmation:</strong> You'll see a success message when booking is complete
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
