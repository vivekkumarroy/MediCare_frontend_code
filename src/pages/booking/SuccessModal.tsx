import { CheckCircle, CalendarDays, Clock, User, Stethoscope, Hash, Download, MapPin, DoorOpen, IndianRupee } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "@/components/ui";
import { formatDate } from "@/lib/utils";
import type { Doctor } from "@/types";
import type { PatientDetails } from "./PatientDetailsModal";

interface SuccessModalProps {
  open: boolean;
  doctor: Doctor | null;
  date: string;
  time: string;
  appointmentId?: string;
  patientDetails?: PatientDetails | null;
  onClose: () => void;
  onBookAnother: () => void;
}

function roundRect(
  ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number,
  r: number | { tl: number; tr: number; br: number; bl: number }
) {
  const rad = typeof r === "number" ? { tl: r, tr: r, br: r, bl: r } : r;
  ctx.beginPath();
  ctx.moveTo(x + rad.tl, y);
  ctx.lineTo(x + w - rad.tr, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + rad.tr);
  ctx.lineTo(x + w, y + h - rad.br);
  ctx.quadraticCurveTo(x + w, y + h, x + w - rad.br, y + h);
  ctx.lineTo(x + rad.bl, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - rad.bl);
  ctx.lineTo(x, y + rad.tl);
  ctx.quadraticCurveTo(x, y, x + rad.tl, y);
  ctx.closePath();
}

function downloadReceipt(data: {
  bookingRef: string; patientName: string; patientAge: string; patientSex: string; patientSymptoms: string;
  doctorName: string; specialty: string; hospitalName: string;
  location: string; cabin: string; consultationFee: number; date: string; time: string;
}) {
  const W = 560; const H = 800;
  const canvas = document.createElement("canvas");
  canvas.width = W * 2; canvas.height = H * 2;
  const ctx = canvas.getContext("2d")!;
  ctx.scale(2, 2);
  const teal = "#4a9ead"; const darkTeal = "#2d7a8a"; const light = "#e8f6f8";
  ctx.fillStyle = "#ffffff"; roundRect(ctx, 0, 0, W, H, 16); ctx.fill();
  const g = ctx.createLinearGradient(0, 0, W, 0);
  g.addColorStop(0, teal); g.addColorStop(1, darkTeal);
  ctx.fillStyle = g; roundRect(ctx, 0, 0, W, 80, { tl: 16, tr: 16, br: 0, bl: 0 }); ctx.fill();
  ctx.fillStyle = "#fff"; ctx.font = "bold 18px system-ui,sans-serif";
  ctx.fillText(data.hospitalName, 24, 32);
  ctx.font = "11px system-ui,sans-serif"; ctx.fillStyle = "rgba(255,255,255,0.8)";
  ctx.fillText("Appointment Booking Receipt", 24, 52);
  ctx.fillText(data.location, 24, 68);
  ctx.fillStyle = "rgba(255,255,255,0.2)"; roundRect(ctx, W - 140, 16, 116, 30, 15); ctx.fill();
  ctx.fillStyle = "#fff"; ctx.font = "bold 11px monospace";
  ctx.fillText("# " + data.bookingRef, W - 128, 36);
  ctx.fillStyle = "#dcfce7"; roundRect(ctx, W - 140, 50, 116, 18, 9); ctx.fill();
  ctx.fillStyle = "#16a34a"; ctx.font = "bold 9px system-ui,sans-serif";
  ctx.textAlign = "center"; ctx.fillText("CONFIRMED", W - 82, 63); ctx.textAlign = "left";
  function dash(y: number) {
    ctx.setLineDash([5, 4]); ctx.strokeStyle = "#e2e8f0"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(24, y); ctx.lineTo(W - 24, y); ctx.stroke(); ctx.setLineDash([]);
  }
  function row(icon: string, label: string, val: string, sub: string, y: number) {
    ctx.fillStyle = light; ctx.beginPath(); ctx.arc(44, y + 16, 17, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = teal; ctx.font = "bold 13px system-ui,sans-serif";
    ctx.textAlign = "center"; ctx.fillText(icon, 44, y + 21); ctx.textAlign = "left";
    ctx.fillStyle = "#94a3b8"; ctx.font = "9px system-ui,sans-serif"; ctx.fillText(label.toUpperCase(), 70, y + 7);
    ctx.fillStyle = "#1e293b"; ctx.font = "bold 13px system-ui,sans-serif"; ctx.fillText(val, 70, y + 22);
    if (sub) { ctx.fillStyle = "#64748b"; ctx.font = "11px system-ui,sans-serif"; ctx.fillText(sub, 70, y + 37); }
  }
  row("P", "Patient", data.patientName, "Age: " + data.patientAge + " | " + data.patientSex, 96);
  ctx.fillStyle = "#64748b"; ctx.font = "10px system-ui,sans-serif";
  ctx.fillText("Symptoms: " + data.patientSymptoms, 70, 152);
  dash(168);
  row("D", "Doctor", data.doctorName, data.specialty, 178);
  dash(234);
  row("H", "Hospital", data.hospitalName, data.location, 244);
  dash(300);
  row("C", "Cabin", data.cabin, "Please report 10 min before appointment", 310);
  dash(366);
  const bw = (W - 56) / 3;
  function box(label: string, val: string, bx: number) {
    ctx.fillStyle = light; roundRect(ctx, bx, 376, bw, 60, 10); ctx.fill();
    ctx.fillStyle = "#94a3b8"; ctx.font = "9px system-ui,sans-serif"; ctx.fillText(label, bx + 12, 394);
    ctx.fillStyle = "#1e293b"; ctx.font = "bold 13px system-ui,sans-serif"; ctx.fillText(val, bx + 12, 416);
  }
  box("DATE", data.date, 24);
  box("TIME", data.time, 24 + bw + 8);
  box("FEE", "Rs." + data.consultationFee, 24 + (bw + 8) * 2);
  dash(452);
  const apptFee = 50; const total = data.consultationFee + apptFee;
  function feeRow(label: string, val: string, y: number, bold = false) {
    ctx.fillStyle = bold ? "#1e293b" : "#64748b";
    ctx.font = bold ? "bold 13px system-ui,sans-serif" : "12px system-ui,sans-serif";
    ctx.fillText(label, 32, y);
    ctx.textAlign = "right"; ctx.fillText(val, W - 32, y); ctx.textAlign = "left";
  }
  feeRow("Consultation Fee", "Rs." + data.consultationFee, 474);
  feeRow("Appointment Booking Fee", "Rs." + apptFee, 494);
  ctx.fillStyle = light; roundRect(ctx, 24, 504, W - 48, 28, 8); ctx.fill();
  feeRow("Total Amount", "Rs." + total, 523, true);
  ctx.fillStyle = light; roundRect(ctx, 0, H - 64, W, 64, { tl: 0, tr: 0, br: 16, bl: 16 }); ctx.fill();
  ctx.fillStyle = teal; ctx.font = "11px system-ui,sans-serif"; ctx.textAlign = "center";
  ctx.fillText("Thank you for choosing MediCare Hospital", W / 2, H - 38);
  ctx.fillStyle = "#94a3b8"; ctx.font = "10px system-ui,sans-serif";
  ctx.fillText("Generated: " + new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }), W / 2, H - 18);
  ctx.textAlign = "left";
  ctx.strokeStyle = "#e2e8f0"; ctx.lineWidth = 1.5;
  roundRect(ctx, 0.75, 0.75, W - 1.5, H - 1.5, 16); ctx.stroke();
  const a = document.createElement("a");
  a.download = "receipt-" + data.bookingRef + ".png";
  a.href = canvas.toDataURL("image/png");
  a.click();
}

export function SuccessModal({ open, doctor, date, time, appointmentId, patientDetails, onClose, onBookAnother }: SuccessModalProps) {
  const navigate = useNavigate();
  const bookingRef = appointmentId?.slice(-8).toUpperCase() ?? "N/A";
  const apptFee = 50;
  const total = (doctor?.consultationFee ?? 0) + apptFee;

  function handleDownload() {
    downloadReceipt({
      bookingRef,
      patientName: patientDetails?.name ?? "Patient",
      patientAge: patientDetails?.age ?? "-",
      patientSex: patientDetails?.sex ?? "-",
      patientSymptoms: patientDetails?.symptoms ?? "-",
      doctorName: doctor?.name ?? "-",
      specialty: doctor?.specialty ?? "-",
      hospitalName: doctor?.hospitalName ?? "MediCare Hospital",
      location: doctor?.location ?? "-",
      cabin: doctor?.cabin ?? "-",
      consultationFee: doctor?.consultationFee ?? 0,
      date: date ? formatDate(date) : "-",
      time: time || "-",
    });
  }

  return (
    <Modal open={open} onClose={onClose} title="Booking Confirmed" size="md">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Appointment Confirmed!</h3>
          <p className="text-sm text-gray-500">Your receipt is ready to download</p>
        </div>

        <div className="rounded-2xl border border-dashed border-[#4a9ead] bg-[#f0f9fb] overflow-hidden text-sm">
          <div className="bg-gradient-to-r from-[#4a9ead] to-[#2d7a8a] px-4 py-3 flex items-center justify-between">
            <div>
              <p className="text-white font-bold text-sm">{doctor?.hospitalName ?? "MediCare Hospital"}</p>
              <p className="text-white/70 text-xs">Booking Receipt</p>
            </div>
            <div className="flex items-center gap-1.5 bg-white/20 rounded-full px-3 py-1">
              <Hash className="w-3 h-3 text-white" />
              <span className="text-white text-xs font-mono font-bold">{bookingRef}</span>
            </div>
          </div>

          <div className="px-4 py-3 space-y-2.5">
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-[#4a9ead]/15 flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-3.5 h-3.5 text-[#4a9ead]" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wide">Patient</p>
                <p className="font-semibold text-gray-800 text-sm">{patientDetails?.name ?? "-"}</p>
                <p className="text-gray-500 text-xs">Age: {patientDetails?.age ?? "-"} &middot; {patientDetails?.sex ?? "-"}</p>
                {patientDetails?.symptoms && (
                  <p className="text-gray-400 text-xs mt-0.5">Symptoms: {patientDetails.symptoms}</p>
                )}
              </div>
            </div>

            <div className="border-t border-dashed border-[#4a9ead]/30" />

            {doctor && (
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-[#4a9ead]/15 flex items-center justify-center shrink-0">
                  <Stethoscope className="w-3.5 h-3.5 text-[#4a9ead]" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wide">Doctor</p>
                  <p className="font-semibold text-gray-800 text-sm">{doctor.name}</p>
                  <p className="text-gray-500 text-xs">{doctor.specialty}</p>
                </div>
              </div>
            )}

            <div className="border-t border-dashed border-[#4a9ead]/30" />

            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#4a9ead] shrink-0" />
                <div>
                  <p className="text-[10px] text-gray-400">Location</p>
                  <p className="font-medium text-gray-800 text-xs">{doctor?.location ?? "-"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <DoorOpen className="w-3.5 h-3.5 text-[#4a9ead] shrink-0" />
                <div>
                  <p className="text-[10px] text-gray-400">Cabin</p>
                  <p className="font-medium text-gray-800 text-xs">{doctor?.cabin ?? "-"}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-dashed border-[#4a9ead]/30" />

            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-3.5 h-3.5 text-[#4a9ead] shrink-0" />
                <div>
                  <p className="text-[10px] text-gray-400">Date</p>
                  <p className="font-medium text-gray-800 text-xs">{date ? formatDate(date) : "-"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#4a9ead] shrink-0" />
                <div>
                  <p className="text-[10px] text-gray-400">Time</p>
                  <p className="font-medium text-gray-800 text-xs">{time || "-"}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-dashed border-[#4a9ead]/30" />

            <div className="space-y-1">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Consultation Fee</span>
                <span className="font-medium text-gray-700">&#8377;{doctor?.consultationFee ?? 0}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Appointment Booking Fee</span>
                <span className="font-medium text-gray-700">&#8377;{apptFee}</span>
              </div>
              <div className="flex justify-between items-center bg-[#4a9ead]/10 rounded-lg px-2 py-1.5 mt-1">
                <span className="text-xs font-bold text-[#2d7a8a] flex items-center gap-1">
                  <IndianRupee className="w-3 h-3" /> Total Amount
                </span>
                <span className="text-sm font-bold text-[#2d7a8a]">&#8377;{total}</span>
              </div>
            </div>

            <div className="border-t border-dashed border-[#4a9ead]/30" />

            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-xs">Status</span>
              <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">Confirmed</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Button onClick={handleDownload} size="lg" className="w-full justify-center gap-2 bg-[#4a9ead] hover:bg-[#3a8e9d]">
            <Download className="w-4 h-4" /> Download Receipt
          </Button>
          <Button onClick={() => navigate("/dashboard/appointments")} variant="secondary" size="lg" className="w-full justify-center">
            View My Appointments
          </Button>
          <Button variant="ghost" onClick={onBookAnother} size="lg" className="w-full justify-center">
            Book Another Appointment
          </Button>
        </div>
      </div>
    </Modal>
  );
}
