## 2.0.0 (04.03.2026)
Version Code: 2
- 'Devam Et' (Revive) sistemi tamamen kaldırıldı. Yanma anında oyuncu direkt "Oyun Bitti" ekranını görecek şekilde düzenlendi.
- Ödüllü reklam sistemi "Ana Menü"ye taşındı. Kullanıcılar ana menüdeki özel butona ("10 ⭐ İÇİN REKLAM İZLE") tıklayarak gönüllü reklam izleyebilecek ve karşılığında 10 yıldız kazanabilecekler.
- Revive ekranı kaldırıldığı için "Oyun Bitti" ekranında artık herhangi bir aracı/geçiş ekranı görünmüyor, direkt skoru ve "Tekrar Dene" butonu görülüyor.
- Ödüllü Reklam (Rewarded Ad) izlenip tamamlandıktan sonra oyuncuya yıldızı doğrudan veren localStorage kayıt sistemi kodlandı.
- Reklamların oyunu yavaşlatmaması için Kademeli Reklam Yükleme (Staggered Loading) sistemi eklendi ve hata durumunda Artan Bekleme (Exponential Backoff) mantığı yazılarak ağ trafiği rahatlatıldı.
- AdMob için özel bir "Reklam Havuzu" (Ad Pool) mimarisi kuruldu. Oyun açıldığında 1'er adet reklam arka planda inip havuzda hazır bekler, izlendikçe kullanılmış kabul edilip yerini otomatik dolduracak şekilde ağ yönetimi optimize edildi.

## 1.0.0 (04.03.2026)
Version Code: 1 - Published
- Initial release
- Fixed UI transition ads (Interstitials) displaying appropriately on Restart/Home
- Preserved ad cooldown matching and play frequency properly with localStorage
- Improved Star collectibles to feature a proper 3D Star geometry and coin-like rotation
- Localized the Game Over screen texts (Score, Best, Try Again) properly based on the language settings