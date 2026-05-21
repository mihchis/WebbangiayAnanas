'use client';

import React, { useState } from 'react';
import { Sparkles, Calendar, ChevronRight, CheckCircle2, Info } from 'lucide-react';

interface AnatomyPart {
  id: string;
  name: string;
  vietnamese: string;
  desc: string;
  x: string; // positioning percentage for interactive dots
  y: string;
}

const anatomyParts: AnatomyPart[] = [
  {
    id: 'toecap',
    name: 'Toe Cap',
    vietnamese: 'Mũi Giày Cao Su',
    desc: 'Bảo vệ phần mũi chân và tăng độ bền bỉ khi di chuyển hoặc tham gia các hoạt động trượt ván, vận động mạnh.',
    x: '15%',
    y: '70%',
  },
  {
    id: 'upper',
    name: 'Upper Canvas',
    vietnamese: 'Thân Giày Vải Canvas',
    desc: 'Chất liệu Canvas sớ lớn dày dặn, thoáng khí, ôm vừa vặn bàn chân và mang lại vẻ bụi bặm retro đặc trưng.',
    x: '45%',
    y: '45%',
  },
  {
    id: 'foxing',
    name: 'Foxing Tape',
    vietnamese: 'Viền Cao Su Lưu Hóa',
    desc: 'Được dán đè xung quanh mép nối thân và đế giày qua quá trình hấp nhiệt (lưu hóa) giúp đôi giày gắn kết cực kỳ chắc chắn.',
    x: '75%',
    y: '65%',
  },
  {
    id: 'outsole',
    name: 'Rubber Outsole',
    vietnamese: 'Đế Cao Su Kẹo Gum',
    desc: 'Mặt đế làm từ cao su tự nhiên với thiết kế vân bám đường cao, chịu mài mòn tốt, đặc trưng của giày Ananas.',
    x: '85%',
    y: '80%',
  },
  {
    id: 'insole',
    name: 'Cushioned Insole',
    vietnamese: 'Lót Giày Êm Ái',
    desc: 'Được cải tiến với chất liệu xốp cao cấp giảm lực chấn động, mang đến cảm giác êm chân dễ chịu cả ngày dài.',
    x: '35%',
    y: '60%',
  },
];

const timelineEvents = [
  {
    year: '2017',
    title: 'Khởi đầu hành trình',
    desc: 'Ananas chính thức ra mắt thị trường Việt Nam với triết lý "Discover You". Đôi giày Basas đầu tiên xuất xưởng đặt viên gạch nền móng cho giấc mơ giày lưu hóa nội địa.',
  },
  {
    year: '2018',
    title: 'Định hình bản sắc',
    desc: 'Trình làng dòng sản phẩm Vintas mang âm hưởng retro cổ điển thập niên 70, nhanh chóng trở thành biểu tượng thời trang của giới trẻ yêu phong cách vintage.',
  },
  {
    year: '2019',
    title: 'Đột phá sáng tạo',
    desc: 'Giới thiệu dòng giày Urbas hiện đại cá tính kết hợp cùng nhiều bộ sưu tập giới hạn lấy cảm hứng từ đời sống đường phố Việt Nam.',
  },
  {
    year: '2020',
    title: 'Hợp tác quốc tế ấn tượng',
    desc: 'Ra mắt các phiên bản collab đình đám như Ananas x Doraemon kỷ niệm 50 năm chú mèo máy và Ananas x Lucky Luke, đưa vị thế thương hiệu lên một tầm cao mới.',
  },
  {
    year: '2022',
    title: 'Kiến tạo tương lai - Track 6',
    desc: 'Giới thiệu dòng giày Track 6 cao cấp lấy cảm hứng từ nhịp điệu nhạc Jazz, kết hợp sớ da lộn mềm mại và đế Gum đặc trưng chịu lực cao.',
  },
  {
    year: '2026',
    title: 'Sải bước vươn tầm',
    desc: 'Ananas mở rộng mạng lưới phân phối toàn quốc, không ngừng cải tiến công nghệ lót giày và chất lượng lưu hóa để sánh vai các thương hiệu lớn.',
  },
];

export default function AboutPage() {
  const [selectedPart, setSelectedPart] = useState<AnatomyPart>(anatomyParts[1]);

  return (
    <div className="w-full bg-neutral-950 text-neutral-100 font-sans flex-1">
      {/* 1. Hero Block */}
      <section className="relative h-[65vh] flex items-center justify-center overflow-hidden border-b border-neutral-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,95,0,0.12)_0%,transparent_65%)]" />
        <div className="absolute inset-0 bg-neutral-950 opacity-40 mix-blend-overlay bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        
        <div className="max-w-4xl mx-auto px-6 text-center z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-500 text-xs font-bold uppercase tracking-wider mb-6 animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Discover You</span>
          </div>
          
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight text-white mb-6">
            BẢN SẮC TRONG <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-orange-400 to-amber-500">
              TỪNG BƯỚC ĐI
            </span>
          </h1>
          
          <p className="text-sm sm:text-base text-neutral-400 max-w-xl mx-auto font-light leading-relaxed">
            Chúng tôi không chỉ sản xuất giày. Ananas là hành trình khám phá bản thân, tôn vinh sự khác biệt và đồng hành cùng thế hệ trẻ Việt Nam trên mọi ngóc ngách cuộc sống.
          </p>
        </div>
        
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Cuộn xuống khám phá</span>
          <div className="w-1.5 h-6 rounded-full bg-neutral-800 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-orange-500 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* 2. Interactive Vulcanized Shoe Breakdown */}
      <section className="py-24 max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-black uppercase text-white tracking-wider mb-4">
            VÌ SAO LÀ GIÀY LƯU HÓA (VULCANIZED)?
          </h2>
          <div className="w-12 h-1.5 bg-orange-500 mx-auto mb-6" />
          <p className="text-xs sm:text-sm text-neutral-400 font-light">
            Giày lưu hóa là loại giày đặc trưng có đế làm bằng cao su nung chảy qua lò luyện nhiệt độ cao để liên kết hoàn toàn với mũ giày vải. Vẻ đẹp thô ráp mang tính cổ điển, càng đi càng cá tính và bền bỉ theo năm tháng.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Interactive Shoe Visual Representation */}
          <div className="lg:col-span-7 bg-neutral-900/50 border border-neutral-800 rounded-3xl p-8 relative overflow-hidden aspect-video flex items-center justify-center group">
            <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/5 to-transparent pointer-events-none" />
            
            {/* Interactive Vector Shoe Outline Placeholder */}
            <div className="relative w-full max-w-lg aspect-[5/3] flex items-center justify-center">
              {/* Outer Shell Wrapper representing a stylized vulcanized shoe silhouette */}
              <div className="w-4/5 h-2/3 border-4 border-dashed border-neutral-700/50 rounded-tr-[100px] rounded-bl-[40px] rounded-br-[20px] rounded-tl-[30px] flex items-center justify-center relative bg-neutral-800/40">
                <span className="text-xs text-neutral-600 font-bold uppercase tracking-wider select-none">Silhouete Giày Ananas</span>
                
                {/* Soles visual segment */}
                <div className="absolute bottom-0 left-0 right-0 h-6 bg-neutral-700/60 rounded-bl-[35px] rounded-br-[15px] border-t-2 border-neutral-600" />
                {/* Toe cap visual segment */}
                <div className="absolute bottom-0 left-0 w-16 h-12 bg-neutral-600/40 rounded-tr-[40px] rounded-bl-[35px]" />
              </div>

              {/* Interaction Hotspots mapped across the silhouette */}
              {anatomyParts.map((part) => (
                <button
                  key={part.id}
                  onClick={() => setSelectedPart(part)}
                  className="absolute w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 z-20 group/btn"
                  style={{ left: part.x, top: part.y }}
                >
                  <span className={`absolute inset-0 rounded-full animate-ping duration-1000 ${
                    selectedPart.id === part.id ? 'bg-orange-500/50' : 'bg-neutral-500/20'
                  }`} />
                  <span className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
                    selectedPart.id === part.id
                      ? 'bg-orange-500 scale-125 shadow-[0_0_12px_rgba(255,95,0,0.8)]'
                      : 'bg-neutral-500 group-hover/btn:bg-orange-400'
                  }`} />
                </button>
              ))}
            </div>
          </div>

          {/* Details pane */}
          <div className="lg:col-span-5 flex flex-col justify-center h-full">
            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-orange-500/10 text-orange-500 px-4 py-1 text-[10px] font-black uppercase tracking-wider rounded-bl-2xl">
                Anatomy Detail
              </div>

              <span className="text-[10px] font-extrabold uppercase text-orange-500 tracking-widest block mb-2">
                {selectedPart.name}
              </span>
              <h3 className="text-2xl font-black uppercase text-white mb-4">
                {selectedPart.vietnamese}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed mb-6">
                {selectedPart.desc}
              </p>

              {/* Secondary Navigation */}
              <div className="border-t border-neutral-800 pt-6">
                <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider block mb-3">
                  Chọn bộ phận để phân tích:
                </span>
                <div className="flex flex-wrap gap-2">
                  {anatomyParts.map((part) => (
                    <button
                      key={part.id}
                      onClick={() => setSelectedPart(part)}
                      className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase transition duration-200 ${
                        selectedPart.id === part.id
                          ? 'bg-orange-500 text-white'
                          : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-white'
                      }`}
                    >
                      {part.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. History Timeline Section */}
      <section className="py-24 bg-neutral-900/30 border-t border-b border-neutral-900 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(255,95,0,0.04)_0%,transparent_70%)] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center max-w-xl mx-auto mb-20">
            <h2 className="text-3xl font-black uppercase text-white tracking-wider mb-4">
              HÀNH TRÌNH PHÁT TRIỂN
            </h2>
            <div className="w-12 h-1.5 bg-orange-500 mx-auto" />
          </div>

          <div className="relative">
            {/* Center connector line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-neutral-800 -translate-x-1/2" />

            <div className="space-y-16">
              {timelineEvents.map((evt, idx) => (
                <div
                  key={evt.year}
                  className={`flex flex-col md:flex-row relative ${
                    idx % 2 === 0 ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  {/* Timeline bullet dot */}
                  <div className="absolute left-4 md:left-1/2 w-8 h-8 rounded-full bg-neutral-950 border-2 border-orange-500 flex items-center justify-center z-10 -translate-x-1/2 shadow-[0_0_8px_rgba(255,95,0,0.3)]">
                    <Calendar className="w-3.5 h-3.5 text-orange-500" />
                  </div>

                  {/* Spacer column */}
                  <div className="hidden md:block w-1/2" />

                  {/* Content column */}
                  <div className="w-full md:w-1/2 pl-12 md:pl-0 md:px-12">
                    <div className="bg-neutral-900/60 border border-neutral-800/80 rounded-2xl p-6 hover:border-orange-500/40 transition duration-300 shadow-sm hover:shadow-md">
                      <span className="text-3xl font-black text-orange-500 font-mono tracking-tight block mb-2">
                        {evt.year}
                      </span>
                      <h4 className="text-base font-bold text-white uppercase mb-3">
                        {evt.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
                        {evt.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Brand Manifesto */}
      <section className="py-24 max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-black uppercase text-white tracking-widest mb-8">
          TUYÊN NGÔN ANANAS
        </h2>
        <div className="text-lg sm:text-2xl font-serif italic text-neutral-300 leading-relaxed font-light mb-8 max-w-3xl mx-auto">
          "Đừng để bất kỳ ai định nghĩa giới hạn của bạn. Đi đôi giày bạn yêu thích, đặt những bước chân kiên định tới nơi bạn chọn và tự hào bộc lộ cái tôi nguyên bản nhất."
        </div>
        <div className="flex justify-center gap-3 items-center">
          <div className="w-8 h-px bg-neutral-700" />
          <span className="text-xs uppercase font-extrabold tracking-widest text-orange-500">Discover You Manifesto</span>
          <div className="w-8 h-px bg-neutral-700" />
        </div>
      </section>
    </div>
  );
}
