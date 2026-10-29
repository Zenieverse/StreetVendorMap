import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  X, 
  MapPin, 
  Clock, 
  ExternalLink, 
  Heart, 
  Share2, 
  CheckCircle2, 
  Bike, 
  Store, 
  Send, 
  AlertCircle, 
  Sparkles, 
  MessageSquare,
  ThumbsUp
} from 'lucide-react';
import { Vendor, Language, VendorReview } from '../types';
import { translations } from '../i18n/translations';
import { isVendorOpenNow, getGoogleMapsUrl } from '../utils/helpers';

interface VendorModalProps {
  vendor: Vendor | null;
  onClose: () => void;
  lang: Language;
  isSaved: boolean;
  onToggleSave: (vendorId: string) => void;
  onCheckIn: (vendorId: string) => void;
  onAddReview: (vendorId: string, review: Omit<VendorReview, 'id' | 'date'>) => void;
}

export const VendorModal: React.FC<VendorModalProps> = ({
  vendor,
  onClose,
  lang,
  isSaved,
  onToggleSave,
  onCheckIn,
  onAddReview,
}) => {
  const [copied, setCopied] = useState(false);
  const [checkedInToday, setCheckedInToday] = useState(false);
  const [authorName, setAuthorName] = useState('');
  const [reviewMessage, setReviewMessage] = useState('');
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportNote, setReportNote] = useState('');
  const [reportSuccess, setReportSuccess] = useState(false);

  if (!vendor) return null;

  const t = translations[lang];
  const isOpen = isVendorOpenNow(vendor);

  // Confetti celebration when user clicks "I bought and supported"
  const handleCheckInClick = () => {
    if (!checkedInToday) {
      setCheckedInToday(true);
      onCheckIn(vendor.id);

      // Trigger colorful warm confetti celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#E07A5F', '#F4A261', '#E76F51', '#2A9D8F'],
        });
      } catch {
        // Fallback gracefully
      }
    }
  };

  const handleShareClick = () => {
    const url = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewMessage.trim()) return;

    onAddReview(vendor.id, {
      author: authorName.trim() || (lang === 'vi' ? 'Người ủng hộ ẩn danh' : 'Kind Supporter'),
      comment: reviewMessage.trim(),
      rating: 5,
    });

    setAuthorName('');
    setReviewMessage('');
  };

  const handleSendReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportNote.trim()) return;
    setReportSuccess(true);
    setTimeout(() => {
      setReportSuccess(false);
      setReportModalOpen(false);
      setReportNote('');
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      
      <div 
        className="relative w-full max-w-2xl bg-[#FFFDF9] rounded-3xl shadow-2xl border border-[#EBDCCB] overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header & Hero Image */}
        <div className="relative h-64 sm:h-72 w-full shrink-0 bg-[#FAF5EE]">
          <img
            src={vendor.imageUrl}
            alt={vendor.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=800&q=80';
            }}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-all active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Top badges */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full text-white shadow-lg ${
                isOpen ? 'bg-emerald-600' : 'bg-stone-600'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isOpen ? 'bg-white animate-pulse' : 'bg-stone-300'}`} />
              {isOpen ? t.status.open : t.status.closed}
            </span>

            {vendor.verified && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-[#E07A5F] text-white shadow-lg">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {t.status.verifiedBadge}
              </span>
            )}
          </div>

          {/* Bottom Title Info */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#FDEBD0] mb-1">
              <span>{vendor.vendorName}</span>
              <span>•</span>
              <span className="bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-md">
                {vendor.vendorAge} {t.card.age}
              </span>
              <span>•</span>
              <span className="capitalize">{t.cities[vendor.city]}</span>
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-bold leading-tight drop-shadow-md">
              {vendor.name}
            </h2>
          </div>
        </div>

        {/* Scrollable Modal Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Quick Action Bar */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Check-in button */}
            <button
              onClick={handleCheckInClick}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold shadow-md transition-all ${
                checkedInToday
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#E07A5F] hover:bg-[#C85A32] text-white active:scale-95'
              }`}
            >
              <ThumbsUp className={`w-4 h-4 ${checkedInToday ? 'animate-bounce' : ''}`} />
              <span>
                {checkedInToday ? t.modal.checkInSuccess : t.modal.checkInBtn}
              </span>
              <span className="bg-black/20 text-white px-2 py-0.5 rounded-full text-xs font-semibold">
                {vendor.checkIns + (checkedInToday ? 1 : 0)}
              </span>
            </button>

            {/* Google Maps Directions */}
            <a
              href={getGoogleMapsUrl(vendor)}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl bg-[#2C241E] hover:bg-[#3D322A] text-white text-xs sm:text-sm font-semibold shadow-md transition-all"
            >
              <MapPin className="w-4 h-4 text-[#F4A261]" />
              <span>{t.modal.directionsBtn}</span>
              <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
            </a>

            {/* Bookmark button */}
            <button
              onClick={() => onToggleSave(vendor.id)}
              className={`p-2.5 rounded-2xl border transition-all ${
                isSaved
                  ? 'bg-rose-50 border-rose-200 text-rose-600'
                  : 'bg-[#FAF5EE] border-[#EBDCCB] text-[#5C4D42] hover:text-[#E07A5F]'
              }`}
              title={isSaved ? t.card.saved : t.card.save}
            >
              <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
            </button>

            {/* Share button */}
            <button
              onClick={handleShareClick}
              className="p-2.5 rounded-2xl bg-[#FAF5EE] border border-[#EBDCCB] text-[#5C4D42] hover:text-[#2C241E] transition-all relative"
              title={t.modal.shareBtn}
            >
              <Share2 className="w-5 h-5" />
              {copied && (
                <span className="absolute -top-8 right-0 bg-[#2C241E] text-white text-[11px] font-medium py-1 px-2 rounded-md shadow-lg whitespace-nowrap">
                  {t.modal.copied}
                </span>
              )}
            </button>
          </div>

          {/* Details Grid: Address, Hours, Mobility, Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
            
            <div className="bg-[#FAF5EE] p-3.5 rounded-2xl border border-[#EBDCCB]/70 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-[#2C241E]">
                <MapPin className="w-4 h-4 text-[#E07A5F]" />
                <span>{lang === 'vi' ? 'Địa chỉ / Điểm bán' : 'Location / Landmark'}</span>
              </div>
              <p className="text-[#5C4D42] leading-relaxed pl-5">
                {vendor.address}
              </p>
            </div>

            <div className="bg-[#FAF5EE] p-3.5 rounded-2xl border border-[#EBDCCB]/70 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-[#2C241E]">
                <Clock className="w-4 h-4 text-[#E07A5F]" />
                <span>{t.card.hours}</span>
              </div>
              <p className="text-[#5C4D42] font-semibold pl-5">
                {vendor.openHours.start} - {vendor.openHours.end} {vendor.openHours.days ? `(${vendor.openHours.days})` : ''}
              </p>
              <div className="text-xs text-[#E07A5F] font-bold pl-5">
                {t.modal.price}: {vendor.priceRange}
              </div>
            </div>

            {/* Mobility Route Note if mobile */}
            {vendor.mobility === 'moving' && vendor.movingRoute && (
              <div className="sm:col-span-2 bg-amber-50/80 p-3.5 rounded-2xl border border-amber-200 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-amber-900">
                  <Bike className="w-4 h-4 text-amber-600" />
                  <span>{t.modal.routeNote}</span>
                </div>
                <p className="text-amber-800 text-xs sm:text-sm leading-relaxed pl-5">
                  {vendor.movingRoute[lang]}
                </p>
              </div>
            )}
          </div>

          {/* Main Specialties */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#8A7968] mb-2">
              {t.modal.specialties}
            </h4>
            <div className="flex flex-wrap gap-2">
              {vendor.specialties[lang].map((item, idx) => (
                <span
                  key={idx}
                  className="bg-[#FAF5EE] border border-[#EBDCCB] text-[#4A3B32] font-medium text-xs sm:text-sm px-3 py-1.5 rounded-xl shadow-2xs"
                >
                  ⭐ {item}
                </span>
              ))}
            </div>
          </div>

          {/* Life Story & Heartfelt Quote */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#8A7968]">
              {t.modal.story}
            </h4>
            <p className="text-sm sm:text-base text-[#4A3B32] leading-relaxed font-normal bg-white p-4 rounded-2xl border border-[#EBDCCB]">
              {vendor.story[lang]}
            </p>

            {/* Quote Block */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-[#FAF5EE] to-[#F7EFE5] border-l-4 border-[#E07A5F] italic text-sm text-[#5C4D42] font-serif leading-relaxed">
              {vendor.quote[lang]}
            </div>
          </div>

          {/* Visitor Note / Contact info */}
          {vendor.notes && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/60 text-xs sm:text-sm text-amber-950">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">{t.modal.phoneNote}: </span>
                <span>{vendor.notes[lang]}</span>
              </div>
            </div>
          )}

          {/* Report Update Location button */}
          <div className="pt-2">
            {!reportModalOpen ? (
              <button
                onClick={() => setReportModalOpen(true)}
                className="text-xs text-[#8A7968] hover:text-[#E07A5F] underline flex items-center gap-1 transition-colors"
              >
                <span>{t.modal.reportUpdateBtn}</span>
              </button>
            ) : (
              <form onSubmit={handleSendReport} className="bg-[#FAF5EE] p-3.5 rounded-2xl border border-[#EBDCCB] space-y-2">
                <div className="text-xs font-bold text-[#2C241E]">
                  {lang === 'vi' ? 'Báo cáo vị trí hoặc trạng thái mới cho gánh hàng này' : 'Report location or new status for this cart'}
                </div>
                <input
                  type="text"
                  value={reportNote}
                  onChange={(e) => setReportNote(e.target.value)}
                  placeholder={lang === 'vi' ? 'Ví dụ: Cụ đã dời qua trước số 30, hoặc hôm nay hết hàng sớm...' : 'E.g., Cart moved across the street, or sold out early...'}
                  className="w-full text-xs p-2 rounded-xl bg-white border border-[#E8DACB] focus:outline-none focus:border-[#E07A5F]"
                />
                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    className="bg-[#2C241E] text-white text-xs font-semibold px-3 py-1.5 rounded-xl hover:bg-[#3D322A]"
                  >
                    {lang === 'vi' ? 'Gửi cập nhật' : 'Submit report'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setReportModalOpen(false)}
                    className="text-xs text-[#8A7968] hover:text-[#2C241E]"
                  >
                    {lang === 'vi' ? 'Đóng' : 'Close'}
                  </button>
                  {reportSuccess && (
                    <span className="text-xs text-emerald-600 font-bold">
                      {lang === 'vi' ? 'Đã ghi nhận! Cảm ơn bạn.' : 'Noted! Thank you.'}
                    </span>
                  )}
                </div>
              </form>
            )}
          </div>

          {/* Community Reviews & Encouraging Messages */}
          <div className="pt-4 border-t border-[#EBDCCB] space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-display text-base font-bold text-[#2C241E] flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#E07A5F]" />
                <span>{t.modal.reviewsTitle}</span>
              </h4>
              <span className="text-xs font-semibold text-[#8A7968]">
                {vendor.reviews.length} {lang === 'vi' ? 'lời nhắn' : 'notes'}
              </span>
            </div>

            {/* Existing Reviews List */}
            <div className="space-y-3">
              {vendor.reviews.length === 0 ? (
                <p className="text-xs text-[#8A7968] italic">
                  {t.modal.noReviewsYet}
                </p>
              ) : (
                vendor.reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="bg-[#FAF5EE] p-3 rounded-2xl border border-[#EBDCCB]/70 space-y-1"
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-[#2C241E]">
                      <span>{rev.author}</span>
                      <span className="text-[11px] font-normal text-[#8A7968]">
                        {rev.date}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#5C4D42] leading-relaxed">
                      {rev.comment}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Leave an Encouraging Note Form */}
            <form onSubmit={handleSubmitReview} className="bg-white p-3.5 rounded-2xl border border-[#EBDCCB] space-y-2.5">
              <div className="text-xs font-bold text-[#2C241E]">
                {t.modal.leaveReview}
              </div>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder={t.modal.yourName}
                className="w-full text-xs p-2.5 rounded-xl bg-[#FAF5EE] border border-[#E8DACB] focus:outline-none focus:border-[#E07A5F] text-[#2C241E]"
              />
              <textarea
                value={reviewMessage}
                onChange={(e) => setReviewMessage(e.target.value)}
                placeholder={t.modal.yourMessage}
                rows={2}
                className="w-full text-xs p-2.5 rounded-xl bg-[#FAF5EE] border border-[#E8DACB] focus:outline-none focus:border-[#E07A5F] text-[#2C241E] resize-none"
              />
              <button
                type="submit"
                disabled={!reviewMessage.trim()}
                className="w-full bg-[#E07A5F] hover:bg-[#C85A32] disabled:opacity-50 text-white text-xs font-bold py-2 rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{t.modal.sendReview}</span>
              </button>
            </form>

          </div>

        </div>

      </div>

    </div>
  );
};
