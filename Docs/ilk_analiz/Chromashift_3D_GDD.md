
# CHROMASHIFT 3D – GAME DESIGN DOCUMENT (GDD)

## 1. GENEL BAKIŞ
Chromashift 3D, Color Switch DNA’sını temel alan; **renk + şekil eşleşmesi** ve **dikey tema geçişi** yeniliğiyle ayrışan, tek parmakla oynanan hiper-casual bir mobil oyundur.

- Tür: Timing / Precision Casual
- Platform: Android & iOS
- Teknoloji: Three.js + WebView / Wrapper
- Hedef: Yüksek retention + ödüllü reklam geliri

---

## 2. CORE GAMEPLAY LOOP
1. Top otomatik olarak zıplar
2. Engel aşağıdan yukarı gelir
3. Oyuncu ekrana dokunur
4. Top:
   - Renk değiştirir
   - Şekil değiştirir
5. Engel ile eşleşme kontrolü:
   - Renk + şekil doğruysa → geçiş
   - Aksi halde → anında kayıp
6. Skor artar, hız yükselir
7. Ölüm → reklam / restart

---

## 3. KONTROLLER
- Tek dokunuş (tap)
- Swipe / hold yok
- Öğrenme süresi: ~5 saniye

---

## 4. RENK SİSTEMİ
### Aktif Renkler
- Kırmızı
- Mavi
- Sarı
- Yeşil

### Kurallar
- Top ve engel renkleri eşleşmeli
- Renk değişimi:
  - Tap ile sırayla
  - Veya checkpoint sonrası random

---

## 5. ŞEKİL SİSTEMİ (ANA YENİLİK)
### Şekiller
- Daire
- Kare
- Üçgen

### Kurallar
- Engel bir şekil ister
- Top aynı şekle sahip olmalı
- Renk doğru, şekil yanlışsa → fail

---

## 6. ENGEL TASARIMI
- Dönerek gelen halkalar
- Şekil kapıları
- Daralan geçitler
- Kombine renk + şekil segmentleri

---

## 7. TEMA & ORTAM GEÇİŞLERİ
Oyuncu yükseldikçe çevre değişir.

### Tema Akışı
1. Grass & Sky
2. Cloud World
3. Space
4. Void

### Geçiş Tetikleri
- Skor bazlı
- Checkpoint bazlı

---

## 8. KAMERA
- Dikey perspektif
- Hafif açılı
- Tema geçişlerinde yumuşak zoom / renk fade

---

## 9. ZORLUK EĞRİSİ
| Süre | Değişiklik |
|----|----|
| 0–10 sn | Sadece renk |
| 10–30 sn | Renk + şekil |
| 30–60 sn | Hız artışı |
| 60+ sn | Tema + dar engeller |

---

## 10. SKOR & PROGRESYON
- Skor: Geçilen engel sayısı
- En yüksek skor kaydı
- Tema unlock’ları skorla açılır

---

## 11. MONETİZASYON
### Reklamlar
- Ölüm sonrası:
  - Devam et (Rewarded)
  - Restart (Interstitial, her 2–3 ölümde)

### Opsiyonel
- Skin unlock → reklam izleyerek

---

## 12. SES & MÜZİK
- Minimal ambient müzik
- Tema bazlı arka plan sesi
- Fail anında kısa ses efekti

---

## 13. TEKNİK NOTLAR (Three.js)
- Basit geometriler
- Tek kamera
- Fog + light ile tema hissi
- 60 FPS hedef

---

## 14. BAŞARI KRİTERLERİ (KPI)
- D1 Retention: %35+
- Ortalama session: 3–5 dk
- Rewarded ad / user / day: 3+

---

## 15. MVP KAPSAMI
- 1 oyun modu
- 4 tema
- 3 şekil
- Full reklam sistemi

---

## 16. GELECEK GÜNCELLEMELER
- Günlük görevler
- Zorluk modları
- Ritim modu (opsiyonel)
