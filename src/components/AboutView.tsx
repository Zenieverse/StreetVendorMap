import React from 'react';
import { 
  HeartHandshake, 
  ShieldCheck, 
  CheckCircle2, 
  MapPin, 
  ShoppingBag, 
  Share2, 
  Users, 
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../i18n/translations';

interface AboutViewProps {
  lang: Language;
}

export const AboutView: React.FC<AboutViewProps> = ({ lang }) => {
  const t = translations[lang];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      
      {/* Hero Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF5EE] border border-[#EBDCCB] text-[#E07A5F] text-xs font-bold uppercase tracking-wider">
          <HeartHandshake className="w-4 h-4" />
          <span>{lang === 'vi' ? 'Tôn Chỉ & Sứ Mệnh' : 'Mission & Core Values'}</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2C241E] leading-tight">
          {t.about.heroTitle}
        </h1>
        <p className="text-base sm:text-lg text-[#6B5A4D] leading-relaxed">
          {t.about.heroSubtitle}
        </p>
      </div>

      {/* The Core 3-NOs Manifesto */}
      <div className="bg-[#FFFDF9] rounded-3xl border-2 border-[#E07A5F]/20 p-6 sm:p-10 shadow-lg space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#E07A5F]">
            {lang === 'vi' ? 'Nguyên Tắc Bất Di Bất Dịch' : 'Uncompromising Foundation'}
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#2C241E]">
            {t.about.threeNoTitle}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-[#FAF5EE] p-6 rounded-2xl border border-[#EBDCCB] space-y-3">
            <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-xl">
              1
            </div>
            <h3 className="font-bold text-lg text-[#2C241E]">
              {t.about.threeNo1Title}
            </h3>
            <p className="text-xs sm:text-sm text-[#5C4D42] leading-relaxed">
              {t.about.threeNo1Desc}
            </p>
          </div>

          <div className="bg-[#FAF5EE] p-6 rounded-2xl border border-[#EBDCCB] space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xl">
              2
            </div>
            <h3 className="font-bold text-lg text-[#2C241E]">
              {t.about.threeNo2Title}
            </h3>
            <p className="text-xs sm:text-sm text-[#5C4D42] leading-relaxed">
              {t.about.threeNo2Desc}
            </p>
          </div>

          <div className="bg-[#FAF5EE] p-6 rounded-2xl border border-[#EBDCCB] space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xl">
              3
            </div>
            <h3 className="font-bold text-lg text-[#2C241E]">
              {t.about.threeNo3Title}
            </h3>
            <p className="text-xs sm:text-sm text-[#5C4D42] leading-relaxed">
              {t.about.threeNo3Desc}
            </p>
          </div>

        </div>
      </div>

      {/* Origin Story: From Google Maps to Digital Platform */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-[#FAF5EE] p-6 sm:p-10 rounded-3xl border border-[#EBDCCB]">
        <div className="space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-[#E07A5F]">
            {lang === 'vi' ? 'Khởi Nguồn Trào Lưu' : 'Movement Origins'}
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#2C241E]">
            {lang === 'vi' ? 'Từ Ghim Vị Trí Google Maps Đến Bản Đồ Số Chuyên Biệt' : 'From Google Maps Pins to a Dedicated Civic Platform'}
          </h2>
          <p className="text-xs sm:text-sm text-[#5C4D42] leading-relaxed">
            {lang === 'vi'
              ? 'Dự án "Gánh Mưu Sinh" khởi nguồn từ phong trào cộng đồng trên Google Maps, nơi giới trẻ và cư dân cùng nhau gắn thẻ những gánh hàng rong của các cụ già neo đơn, người khuyết tật. Nhận thấy người bán rong thường xuyên di chuyển hoặc đổi khung giờ, nền tảng số ra đời để giúp thông tin luôn được cập nhật chính xác từng giờ.'
              : 'The "Gánh Mưu Sinh" movement originally sparked on Google Maps, where citizens and youth collaboratively pinned coordinates of elderly and disabled street hawkers. Because mobile vendors often push carts across blocks, this dedicated map ensures live moving routes and hours remain accurate.'}
          </p>
        </div>

        <div className="space-y-3">
          <div className="bg-white p-4 rounded-2xl border border-[#EBDCCB] shadow-2xs space-y-1">
            <div className="font-bold text-xs text-[#2C241E] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{lang === 'vi' ? 'Không phân biệt vùng miền' : 'Nationwide coverage'}</span>
            </div>
            <p className="text-xs text-[#6B5A4D]">
              {lang === 'vi' ? 'Có mặt từ Sài Gòn, Hà Nội, Đà Nẵng đến Cần Thơ, xứ Huế.' : 'Covering Ho Chi Minh City, Hanoi, Da Nang, Can Tho, and Hue.'}
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#EBDCCB] shadow-2xs space-y-1">
            <div className="font-bold text-xs text-[#2C241E] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{lang === 'vi' ? 'Xác thực cộng đồng phi lợi nhuận' : 'Non-profit crowd verification'}</span>
            </div>
            <p className="text-xs text-[#6B5A4D]">
              {lang === 'vi' ? '100% tình nguyện, dữ liệu đóng góp từ những người đi đường chân thật.' : '100% civic volunteer effort powered by real passersby.'}
            </p>
          </div>
        </div>
      </div>

      {/* How you can help - 3 Steps */}
      <div className="space-y-8">
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-center text-[#2C241E]">
          {t.about.howItWorksTitle}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-[#FFFDF9] rounded-2xl border border-[#EBDCCB] space-y-3">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#FAF5EE] text-[#E07A5F] flex items-center justify-center border border-[#EBDCCB]">
              <MapPin className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-base text-[#2C241E]">
              {t.about.step1Title}
            </h3>
            <p className="text-xs text-[#6B5A4D] leading-relaxed">
              {t.about.step1Desc}
            </p>
          </div>

          <div className="text-center p-6 bg-[#FFFDF9] rounded-2xl border border-[#EBDCCB] space-y-3">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#FAF5EE] text-[#E07A5F] flex items-center justify-center border border-[#EBDCCB]">
              <ShoppingBag className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-base text-[#2C241E]">
              {t.about.step2Title}
            </h3>
            <p className="text-xs text-[#6B5A4D] leading-relaxed">
              {t.about.step2Desc}
            </p>
          </div>

          <div className="text-center p-6 bg-[#FFFDF9] rounded-2xl border border-[#EBDCCB] space-y-3">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#FAF5EE] text-[#E07A5F] flex items-center justify-center border border-[#EBDCCB]">
              <Share2 className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-base text-[#2C241E]">
              {t.about.step3Title}
            </h3>
            <p className="text-xs text-[#6B5A4D] leading-relaxed">
              {t.about.step3Desc}
            </p>
          </div>
        </div>
      </div>

      {/* Community Stats Impact */}
      <div className="bg-[#2C241E] text-white p-8 sm:p-12 rounded-3xl shadow-xl space-y-8">
        <div className="text-center space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-[#F4A261]">
            {lang === 'vi' ? 'Con Số Biết Nói' : 'Impact Counter'}
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold">
            {t.about.statsTitle}
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <div className="font-display text-3xl sm:text-4xl font-bold text-[#F4A261]">
              186+
            </div>
            <div className="text-xs text-stone-300">
              {t.about.statsVendors}
            </div>
          </div>

          <div className="space-y-1">
            <div className="font-display text-3xl sm:text-4xl font-bold text-[#F4A261]">
              15.4K+
            </div>
            <div className="text-xs text-stone-300">
              {t.about.statsPurchases}
            </div>
          </div>

          <div className="space-y-1">
            <div className="font-display text-3xl sm:text-4xl font-bold text-[#F4A261]">
              6
            </div>
            <div className="text-xs text-stone-300">
              {t.about.statsCities}
            </div>
          </div>

          <div className="space-y-1">
            <div className="font-display text-3xl sm:text-4xl font-bold text-[#F4A261]">
              100%
            </div>
            <div className="text-xs text-stone-300">
              {lang === 'vi' ? 'Phi lợi nhuận' : 'Non-profit'}
            </div>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <HelpCircle className="w-6 h-6 text-[#E07A5F] mx-auto" />
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#2C241E]">
            {lang === 'vi' ? 'Câu Hỏi Thường Gặp (FAQ)' : 'Frequently Asked Questions'}
          </h2>
        </div>

        <div className="space-y-3">
          <div className="bg-[#FAF5EE] p-5 rounded-2xl border border-[#EBDCCB] space-y-1">
            <h4 className="font-bold text-sm text-[#2C241E]">
              {lang === 'vi' ? 'Tôi có thể quyên góp tiền cho ban quản trị dự án không?' : 'Can I donate cash to the platform organizers?'}
            </h4>
            <p className="text-xs text-[#5C4D42] leading-relaxed">
              {lang === 'vi'
                ? 'Tuyệt đối KHÔNG. Dự án không nhận bất kỳ đồng nào. Mọi sự ủng hộ xin hãy trực tiếp đến các gánh hàng rong để mua một phần ăn, ly nước cho các cụ.'
                : 'Absolutely NOT. We strictly refuse any cash donations. If you wish to support, please visit the street hawkers directly and buy their delicious food.'}
            </p>
          </div>

          <div className="bg-[#FAF5EE] p-5 rounded-2xl border border-[#EBDCCB] space-y-1">
            <h4 className="font-bold text-sm text-[#2C241E]">
              {lang === 'vi' ? 'Làm sao để biết thông tin một gánh hàng rong là chính xác?' : 'How is vendor information verified?'}
            </h4>
            <p className="text-xs text-[#5C4D42] leading-relaxed">
              {lang === 'vi'
                ? 'Thông tin được cập nhật và kiểm tra chéo bởi cộng đồng qua các lần check-in, chụp ảnh và đánh giá thực tế. Bạn cũng có thể bấm "Cập nhật vị trí" nếu thấy có thay đổi.'
                : 'Data is cross-verified by real community members via regular check-ins, photos, and on-site visits. You can also submit location updates anytime.'}
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
