import React, { useState, useEffect, useRef } from "react";

// ====== طيف — استوديو الذكاء الاصطناعي لتوليد الصور والفيديو ======
// واجهة متعددة اللغات (11 لغة) مع تبديل تلقائي RTL/LTR.

const SPECTRUM = "linear-gradient(115deg, #6F8BC4 0%, #8487B6 50%, #93B0C4 100%)";

// اللغات المتاحة
const LANGS = [
  { code: "ar", name: "العربية", dir: "rtl" },
  { code: "en", name: "English", dir: "ltr" },
  { code: "ku", name: "کوردی", dir: "rtl" },
  { code: "fa", name: "فارسی", dir: "rtl" },
  { code: "ur", name: "اردو", dir: "rtl" },
  { code: "tr", name: "Türkçe", dir: "ltr" },
  { code: "fr", name: "Français", dir: "ltr" },
  { code: "es", name: "Español", dir: "ltr" },
  { code: "de", name: "Deutsch", dir: "ltr" },
  { code: "ru", name: "Русский", dir: "ltr" },
  { code: "hi", name: "हिन्दी", dir: "ltr" },
];

// قاموس الترجمة
const T = {
  ar: { brand:"طيف", nav:["الاستوديو","المعرض","المزايا"], login:"تسجيل الدخول",
    eyebrow:"استوديو الذكاء الاصطناعي · جيل جديد", h1a:"من", h1g:"الكلمة", h1b:"إلى صورة أو فيديو في ثوانٍ",
    subA:"اكتب فكرتك", subG:"بأي لغة", subB:"— والذكاء الاصطناعي يفهمها ويحوّلها إلى محتوى احترافي جاهز للريلز والمنشورات.",
    image:"صورة", video:"فيديو",
    phImg:"مثال: قطة فضائية تجلس على سطح المريخ وتنظر إلى الأرض البعيدة، إضاءة سينمائية...",
    phVid:"مثال: فتاة تمشي وسط شارع مطر ليلاً مع أضواء نيون منعكسة على الأرض، كاميرا تتحرك ببطء...",
    enhance:"حسّن الوصف بالذكاء الاصطناعي", enhancing:"جارٍ التحسين…", hint:"يحوّل فكرتك إلى وصف إنجليزي مفصّل لنتائج أقوى",
    errRetry:"تعذّر التحسين. حاول مرة أخرى.", errConn:"تعذّر الاتصال بخدمة الذكاء الاصطناعي. حاول مرة أخرى.",
    enhancedT:"الوصف المُحسّن", copy:"نسخ", modelLabel:"نموذج التوليد", bRec:"موصى به", bVal:"أفضل قيمة",bCheap:"الأرخص",
    nVeo:"صوت أصلي متزامن · الأكثر اكتمالاً", nKling:"4K · 60fps · 15s · اقتصادي", nSeed:"أفضل حركة وفيزياء · قريباً عبر API",nEco:"اقتصادي · يُستخدم في التجربة المجانية",locked:"بالاشتراك",
    durLabel:"مدة الفيديو", sec:"ثانية", styleLabel:"النمط",
    styles:{cinematic:"سينمائي",photoreal:"واقعي",anime:"أنمي",td:"ثلاثي الأبعاد",neon:"نيون",minimal:"بسيط"},
    ratioLabel:"نسبة الأبعاد", ratios:{reels:"ريلز",square:"مربع",wide:"عريض",post:"بوست"},
    countLabel:"عدد النتائج", genImg:"توليد الصور", genVid:"توليد الفيديو",
    empty:"ستظهر نتائجك هنا. جرّب كتابة فكرة ثم اضغط «توليد».", result:"نتيجة",
    galTitle:"أمثلة على ما يمكن إنشاؤه", preview:"معاينة", featTitle:"لماذا طيف",
    f1t:"يفهم كل اللغات", f1d:"اكتب بالعربية أو الكردية أو الإنجليزية أو أي لغة، فيحوّلها إلى وصف احترافي دقيق.",
    f2t:"صور وفيديو معاً", f2d:"توليد الصور والفيديو القصير من مكان واحد بنفس الواجهة.",
    f3t:"جاهز للسوشيال", f3d:"مقاسات مهيّأة للريلز والمنشورات مباشرة دون قص أو تعديل.",
    f4t:"بسيط واحترافي", f4d:"واجهة نظيفة تركّز على الإبداع لا على التعقيد.",
    footer:"استوديو الذكاء الاصطناعي لتوليد الصور والفيديو · نموذج واجهة" },

  en: { brand:"Tayf", nav:["Studio","Gallery","Features"], login:"Sign in",
    eyebrow:"AI Studio · New generation", h1a:"From a", h1g:"word", h1b:"to an image or video in seconds",
    subA:"Write your idea", subG:"in any language", subB:"— AI understands it and turns it into professional content ready for Reels and posts.",
    image:"Image", video:"Video",
    phImg:"e.g. A space cat sitting on the surface of Mars gazing at distant Earth, cinematic lighting...",
    phVid:"e.g. A girl walks down a rainy street at night with neon lights reflecting on the ground, slow camera move...",
    enhance:"Enhance prompt with AI", enhancing:"Enhancing…", hint:"Turns your idea into a detailed English prompt for stronger results",
    errRetry:"Couldn't enhance. Try again.", errConn:"Couldn't reach the AI service. Try again.",
    enhancedT:"Enhanced prompt", copy:"Copy", modelLabel:"Generation model", bRec:"Recommended", bVal:"Best value",bCheap:"Cheapest",
    nVeo:"Native synced audio · most complete", nKling:"4K · 60fps · 15s · best value", nSeed:"Best motion & physics · API soon",nEco:"Economy · used for the free trial",locked:"Subscribers",
    durLabel:"Video duration", sec:"sec", styleLabel:"Style",
    styles:{cinematic:"Cinematic",photoreal:"Photoreal",anime:"Anime",td:"3D",neon:"Neon",minimal:"Minimal"},
    ratioLabel:"Aspect ratio", ratios:{reels:"Reels",square:"Square",wide:"Wide",post:"Post"},
    countLabel:"Results", genImg:"Generate images", genVid:"Generate video",
    empty:"Your results will appear here. Try writing an idea, then press Generate.", result:"results",
    galTitle:"Examples of what you can create", preview:"preview", featTitle:"Why Tayf",
    f1t:"Understands every language", f1d:"Write in Arabic, Kurdish, English or any language — it becomes a precise pro prompt.",
    f2t:"Images and video together", f2d:"Generate images and short video from one place, one interface.",
    f3t:"Social-ready", f3d:"Sizes prepared for Reels and posts directly, no cropping needed.",
    f4t:"Simple and pro", f4d:"A clean interface focused on creativity, not complexity.",
    footer:"AI studio for image & video generation · UI prototype" },

  ku: { brand:"تەیف", nav:["ستۆدیۆ","گالێری","تایبەتمەندی"], login:"چوونەژوورەوە",
    eyebrow:"ستۆدیۆی زیرەکی دەستکرد · نەوەی نوێ", h1a:"لە", h1g:"وشە", h1b:"بۆ وێنە یان ڤیدیۆ لە چەند چرکەیەکدا",
    subA:"بیرۆکەکەت بنووسە", subG:"بە هەر زمانێک", subB:"— زیرەکی دەستکرد لێی تێدەگات و دەیکات بە ناوەڕۆکێکی پیشەیی ئامادە بۆ ڕیلز و پۆست.",
    image:"وێنە", video:"ڤیدیۆ",
    phImg:"نموونە: پشیلەیەکی ئاسمانی لەسەر ڕووی مەریخ دانیشتووە و سەیری زەوی دوور دەکات، ڕووناکی سینەمایی...",
    phVid:"نموونە: کچێک بە شەقامێکی بارانیدا بە شەو دەڕوات و ڕووناکی نیۆن لەسەر زەوی دەدرەوشێتەوە، کامێرا هێواش دەجووڵێت...",
    enhance:"باشترکردنی وەسف بە AI", enhancing:"باشتر دەکرێت…", hint:"بیرۆکەکەت دەکات بە وەسفێکی وردی ئینگلیزی بۆ ئەنجامی بەهێزتر",
    errRetry:"باشترکردن سەرکەوتوو نەبوو. دووبارە هەوڵبدە.", errConn:"پەیوەندی بە خزمەتگوزاری AI نەکرا. دووبارە هەوڵبدە.",
    enhancedT:"وەسفی باشترکراو", copy:"کۆپی", modelLabel:"مۆدێلی دروستکردن", bRec:"پێشنیارکراو", bVal:"باشترین نرخ",bCheap:"هەرزانترین",
    nVeo:"دەنگی سروشتی هاوکات · تەواوترین", nKling:"4K · 60fps · 15s · باشترین نرخ", nSeed:"باشترین جووڵە و فیزیک · بەمزووانە بە API",nEco:"هەرزان · بۆ تاقیکردنەوەی بەخۆڕایی",locked:"بە بەشداری",
    durLabel:"ماوەی ڤیدیۆ", sec:"چرکە", styleLabel:"شێواز",
    styles:{cinematic:"سینەمایی",photoreal:"ڕاستەقینە",anime:"ئەنیمە",td:"سێ ڕەهەندی",neon:"نیۆن",minimal:"سادە"},
    ratioLabel:"ڕێژەی ڕووبەر", ratios:{reels:"ڕیلز",square:"چوارگۆشە",wide:"پان",post:"پۆست"},
    countLabel:"ژمارەی ئەنجام", genImg:"دروستکردنی وێنە", genVid:"دروستکردنی ڤیدیۆ",
    empty:"ئەنجامەکانت لێرە دەردەکەون. بیرۆکەیەک بنووسە و دوای ئەوە «دروستکردن» دابگرە.", result:"ئەنجام",
    galTitle:"نموونە لەوەی دەتوانیت دروستی بکەیت", preview:"پێشبینین", featTitle:"بۆچی تەیف",
    f1t:"هەموو زمانێک تێدەگات", f1d:"بە کوردی، عەرەبی، ئینگلیزی یان هەر زمانێک بنووسە — دەبێت بە وەسفێکی پیشەیی ورد.",
    f2t:"وێنە و ڤیدیۆ پێکەوە", f2d:"دروستکردنی وێنە و ڤیدیۆی کورت لە یەک شوێن، یەک ڕووکار.",
    f3t:"ئامادە بۆ سۆشیال", f3d:"قەبارەکان ئامادەن بۆ ڕیلز و پۆست ڕاستەوخۆ، بەبێ بڕین.",
    f4t:"سادە و پیشەیی", f4d:"ڕووکارێکی پاک کە سەرنج دەداتە داهێنان نەک ئاڵۆزی.",
    footer:"ستۆدیۆی AI بۆ دروستکردنی وێنە و ڤیدیۆ · نموونەی ڕووکار" },

  fa: { brand:"طیف", nav:["استودیو","گالری","ویژگی‌ها"], login:"ورود",
    eyebrow:"استودیوی هوش مصنوعی · نسل جدید", h1a:"از یک", h1g:"کلمه", h1b:"تا تصویر یا ویدیو در چند ثانیه",
    subA:"ایده‌ات را بنویس", subG:"به هر زبانی", subB:"— هوش مصنوعی آن را می‌فهمد و به محتوای حرفه‌ای آمادهٔ ریلز و پست تبدیل می‌کند.",
    image:"تصویر", video:"ویدیو",
    phImg:"مثال: گربه‌ای فضایی روی سطح مریخ نشسته و به زمین دور نگاه می‌کند، نورپردازی سینمایی...",
    phVid:"مثال: دختری شب در خیابانی بارانی راه می‌رود و نورهای نئون روی زمین منعکس شده، حرکت آرام دوربین...",
    enhance:"بهبود توضیح با هوش مصنوعی", enhancing:"در حال بهبود…", hint:"ایده‌ات را به توضیح انگلیسی دقیق برای نتایج قوی‌تر تبدیل می‌کند",
    errRetry:"بهبود ممکن نشد. دوباره تلاش کن.", errConn:"اتصال به سرویس هوش مصنوعی ممکن نشد. دوباره تلاش کن.",
    enhancedT:"توضیح بهبودیافته", copy:"کپی", modelLabel:"مدل تولید", bRec:"پیشنهادی", bVal:"بهترین ارزش",bCheap:"ارزان‌ترین",
    nVeo:"صدای همگام بومی · کامل‌ترین", nKling:"4K · 60fps · 15s · مقرون‌به‌صرفه", nSeed:"بهترین حرکت و فیزیک · به‌زودی با API",nEco:"اقتصادی · برای آزمایش رایگان",locked:"با اشتراک",
    durLabel:"مدت ویدیو", sec:"ثانیه", styleLabel:"سبک",
    styles:{cinematic:"سینمایی",photoreal:"واقع‌گرا",anime:"انیمه",td:"سه‌بعدی",neon:"نئون",minimal:"مینیمال"},
    ratioLabel:"نسبت ابعاد", ratios:{reels:"ریلز",square:"مربع",wide:"عریض",post:"پست"},
    countLabel:"تعداد نتایج", genImg:"تولید تصاویر", genVid:"تولید ویدیو",
    empty:"نتایج تو اینجا ظاهر می‌شوند. یک ایده بنویس و «تولید» را بزن.", result:"نتیجه",
    galTitle:"نمونه‌هایی از آنچه می‌توانی بسازی", preview:"پیش‌نمایش", featTitle:"چرا طیف",
    f1t:"هر زبانی را می‌فهمد", f1d:"به فارسی، عربی، انگلیسی یا هر زبانی بنویس — به توضیحی حرفه‌ای و دقیق تبدیل می‌شود.",
    f2t:"تصویر و ویدیو با هم", f2d:"تولید تصویر و ویدیوی کوتاه از یک جا، یک رابط.",
    f3t:"آمادهٔ شبکه‌های اجتماعی", f3d:"اندازه‌ها برای ریلز و پست آماده‌اند، بدون نیاز به برش.",
    f4t:"ساده و حرفه‌ای", f4d:"رابطی تمیز با تمرکز بر خلاقیت، نه پیچیدگی.",
    footer:"استودیوی هوش مصنوعی برای تولید تصویر و ویدیو · نمونهٔ رابط" },

  ur: { brand:"طیف", nav:["اسٹوڈیو","گیلری","خصوصیات"], login:"سائن ان",
    eyebrow:"اے آئی اسٹوڈیو · نئی نسل", h1a:"ایک", h1g:"لفظ", h1b:"سے سیکنڈوں میں تصویر یا ویڈیو تک",
    subA:"اپنا خیال لکھیں", subG:"کسی بھی زبان میں", subB:"— اے آئی اسے سمجھتا ہے اور ریلز و پوسٹ کے لیے پیشہ ورانہ مواد بنا دیتا ہے۔",
    image:"تصویر", video:"ویڈیو",
    phImg:"مثال: ایک خلائی بلی مریخ کی سطح پر بیٹھی دور زمین کو دیکھ رہی ہے، سینمائی روشنی...",
    phVid:"مثال: ایک لڑکی رات کو بارش والی سڑک پر چل رہی ہے، نیون روشنیاں زمین پر منعکس، کیمرہ آہستہ حرکت...",
    enhance:"اے آئی سے تفصیل بہتر بنائیں", enhancing:"بہتر کیا جا رہا ہے…", hint:"آپ کے خیال کو مضبوط نتائج کے لیے تفصیلی انگریزی پرامپٹ میں بدلتا ہے",
    errRetry:"بہتر نہیں ہو سکا۔ دوبارہ کوشش کریں۔", errConn:"اے آئی سروس سے رابطہ نہ ہو سکا۔ دوبارہ کوشش کریں۔",
    enhancedT:"بہتر شدہ تفصیل", copy:"کاپی", modelLabel:"جنریشن ماڈل", bRec:"تجویز کردہ", bVal:"بہترین قیمت",bCheap:"سب سے سستا",
    nVeo:"مقامی ہم وقت آڈیو · سب سے مکمل", nKling:"4K · 60fps · 15s · بہترین قیمت", nSeed:"بہترین حرکت و فزکس · جلد API",nEco:"اکانمی · مفت ٹرائل کے لیے",locked:"سبسکرپشن پر",
    durLabel:"ویڈیو دورانیہ", sec:"سیکنڈ", styleLabel:"انداز",
    styles:{cinematic:"سینمائی",photoreal:"حقیقی",anime:"اینیمے",td:"تھری ڈی",neon:"نیون",minimal:"سادہ"},
    ratioLabel:"تناسب", ratios:{reels:"ریلز",square:"مربع",wide:"چوڑا",post:"پوسٹ"},
    countLabel:"نتائج کی تعداد", genImg:"تصاویر بنائیں", genVid:"ویڈیو بنائیں",
    empty:"آپ کے نتائج یہاں ظاہر ہوں گے۔ ایک خیال لکھیں پھر «بنائیں» دبائیں۔", result:"نتائج",
    galTitle:"آپ کیا بنا سکتے ہیں اس کی مثالیں", preview:"پیش منظر", featTitle:"طیف کیوں",
    f1t:"ہر زبان سمجھتا ہے", f1d:"اردو، عربی، انگریزی یا کسی بھی زبان میں لکھیں — یہ درست پیشہ ورانہ پرامپٹ بن جاتا ہے۔",
    f2t:"تصویر اور ویڈیو ایک ساتھ", f2d:"ایک جگہ، ایک انٹرفیس سے تصویر اور مختصر ویڈیو بنائیں۔",
    f3t:"سوشل کے لیے تیار", f3d:"ریلز اور پوسٹ کے لیے سائز تیار، کاٹنے کی ضرورت نہیں۔",
    f4t:"سادہ اور پیشہ ورانہ", f4d:"ایک صاف انٹرفیس جو تخلیق پر مرکوز ہے، پیچیدگی پر نہیں۔",
    footer:"تصویر و ویڈیو جنریشن کے لیے اے آئی اسٹوڈیو · انٹرفیس نمونہ" },

  tr: { brand:"Tayf", nav:["Stüdyo","Galeri","Özellikler"], login:"Giriş yap",
    eyebrow:"Yapay Zeka Stüdyosu · Yeni nesil", h1a:"Bir", h1g:"kelimeden", h1b:"saniyeler içinde görsele veya videoya",
    subA:"Fikrini yaz", subG:"herhangi bir dilde", subB:"— yapay zeka anlar ve Reels ile gönderiler için profesyonel içeriğe dönüştürür.",
    image:"Görsel", video:"Video",
    phImg:"örn. Mars yüzeyinde oturup uzaktaki Dünya'ya bakan uzaylı bir kedi, sinematik ışık...",
    phVid:"örn. Yağmurlu bir sokakta geceleyin yürüyen bir kız, yerde yansıyan neon ışıklar, yavaş kamera hareketi...",
    enhance:"İstemi yapay zeka ile geliştir", enhancing:"Geliştiriliyor…", hint:"Fikrini daha güçlü sonuçlar için ayrıntılı İngilizce isteme dönüştürür",
    errRetry:"Geliştirilemedi. Tekrar dene.", errConn:"Yapay zeka servisine ulaşılamadı. Tekrar dene.",
    enhancedT:"Geliştirilmiş istem", copy:"Kopyala", modelLabel:"Üretim modeli", bRec:"Önerilen", bVal:"En iyi değer",bCheap:"En ucuz",
    nVeo:"Yerel senkron ses · en eksiksiz", nKling:"4K · 60fps · 15s · en iyi değer", nSeed:"En iyi hareket ve fizik · yakında API",nEco:"Ekonomik · ücretsiz deneme için",locked:"Abonelere",
    durLabel:"Video süresi", sec:"sn", styleLabel:"Stil",
    styles:{cinematic:"Sinematik",photoreal:"Gerçekçi",anime:"Anime",td:"3B",neon:"Neon",minimal:"Minimal"},
    ratioLabel:"En boy oranı", ratios:{reels:"Reels",square:"Kare",wide:"Geniş",post:"Gönderi"},
    countLabel:"Sonuç sayısı", genImg:"Görsel üret", genVid:"Video üret",
    empty:"Sonuçların burada görünecek. Bir fikir yaz ve «Üret»e bas.", result:"sonuç",
    galTitle:"Neler oluşturabileceğine örnekler", preview:"önizleme", featTitle:"Neden Tayf",
    f1t:"Her dili anlar", f1d:"Türkçe, Arapça, İngilizce ya da herhangi bir dilde yaz — kesin profesyonel isteme dönüşür.",
    f2t:"Görsel ve video birlikte", f2d:"Tek yerden, tek arayüzden görsel ve kısa video üret.",
    f3t:"Sosyale hazır", f3d:"Reels ve gönderiler için boyutlar hazır, kırpmaya gerek yok.",
    f4t:"Sade ve profesyonel", f4d:"Karmaşaya değil, yaratıcılığa odaklanan temiz bir arayüz.",
    footer:"Görsel ve video üretimi için yapay zeka stüdyosu · Arayüz prototipi" },

  fr: { brand:"Tayf", nav:["Studio","Galerie","Fonctions"], login:"Connexion",
    eyebrow:"Studio IA · Nouvelle génération", h1a:"D'un", h1g:"mot", h1b:"à une image ou vidéo en quelques secondes",
    subA:"Écris ton idée", subG:"dans n'importe quelle langue", subB:"— l'IA la comprend et la transforme en contenu pro prêt pour les Reels et les posts.",
    image:"Image", video:"Vidéo",
    phImg:"ex. Un chat spatial assis à la surface de Mars regardant la Terre lointaine, éclairage cinématographique...",
    phVid:"ex. Une fille marche dans une rue pluvieuse la nuit, néons reflétés au sol, mouvement de caméra lent...",
    enhance:"Améliorer le prompt avec l'IA", enhancing:"Amélioration…", hint:"Transforme ton idée en prompt anglais détaillé pour de meilleurs résultats",
    errRetry:"Échec de l'amélioration. Réessaie.", errConn:"Impossible de joindre le service IA. Réessaie.",
    enhancedT:"Prompt amélioré", copy:"Copier", modelLabel:"Modèle de génération", bRec:"Recommandé", bVal:"Meilleur rapport",bCheap:"Le moins cher",
    nVeo:"Audio synchronisé natif · le plus complet", nKling:"4K · 60fps · 15s · meilleur rapport", nSeed:"Meilleur mouvement et physique · API bientôt",nEco:"Économique · pour l'essai gratuit",locked:"Abonnés",
    durLabel:"Durée de la vidéo", sec:"s", styleLabel:"Style",
    styles:{cinematic:"Cinématique",photoreal:"Photoréaliste",anime:"Anime",td:"3D",neon:"Néon",minimal:"Minimal"},
    ratioLabel:"Format", ratios:{reels:"Reels",square:"Carré",wide:"Large",post:"Post"},
    countLabel:"Résultats", genImg:"Générer des images", genVid:"Générer la vidéo",
    empty:"Tes résultats apparaîtront ici. Écris une idée puis appuie sur « Générer ».", result:"résultats",
    galTitle:"Exemples de ce que tu peux créer", preview:"aperçu", featTitle:"Pourquoi Tayf",
    f1t:"Comprend toutes les langues", f1d:"Écris en français, arabe, anglais ou toute langue — ça devient un prompt pro précis.",
    f2t:"Images et vidéo ensemble", f2d:"Génère images et vidéos courtes au même endroit, une seule interface.",
    f3t:"Prêt pour les réseaux", f3d:"Formats prêts pour Reels et posts, sans recadrage.",
    f4t:"Simple et pro", f4d:"Une interface épurée centrée sur la créativité, pas la complexité.",
    footer:"Studio IA pour la génération d'images et vidéos · Prototype d'interface" },

  es: { brand:"Tayf", nav:["Estudio","Galería","Funciones"], login:"Iniciar sesión",
    eyebrow:"Estudio de IA · Nueva generación", h1a:"De una", h1g:"palabra", h1b:"a una imagen o video en segundos",
    subA:"Escribe tu idea", subG:"en cualquier idioma", subB:"— la IA la entiende y la convierte en contenido profesional listo para Reels y publicaciones.",
    image:"Imagen", video:"Video",
    phImg:"p. ej. Un gato espacial sentado en la superficie de Marte mirando la Tierra lejana, iluminación cinematográfica...",
    phVid:"p. ej. Una chica camina por una calle lluviosa de noche, luces de neón reflejadas en el suelo, cámara lenta...",
    enhance:"Mejorar prompt con IA", enhancing:"Mejorando…", hint:"Convierte tu idea en un prompt detallado en inglés para mejores resultados",
    errRetry:"No se pudo mejorar. Inténtalo de nuevo.", errConn:"No se pudo conectar con el servicio de IA. Inténtalo de nuevo.",
    enhancedT:"Prompt mejorado", copy:"Copiar", modelLabel:"Modelo de generación", bRec:"Recomendado", bVal:"Mejor valor",bCheap:"Más barato",
    nVeo:"Audio nativo sincronizado · el más completo", nKling:"4K · 60fps · 15s · mejor valor", nSeed:"Mejor movimiento y física · API pronto",nEco:"Económico · para la prueba gratis",locked:"Suscriptores",
    durLabel:"Duración del video", sec:"s", styleLabel:"Estilo",
    styles:{cinematic:"Cinematográfico",photoreal:"Realista",anime:"Anime",td:"3D",neon:"Neón",minimal:"Minimalista"},
    ratioLabel:"Relación de aspecto", ratios:{reels:"Reels",square:"Cuadrado",wide:"Ancho",post:"Post"},
    countLabel:"Resultados", genImg:"Generar imágenes", genVid:"Generar video",
    empty:"Tus resultados aparecerán aquí. Escribe una idea y pulsa «Generar».", result:"resultados",
    galTitle:"Ejemplos de lo que puedes crear", preview:"vista previa", featTitle:"Por qué Tayf",
    f1t:"Entiende todos los idiomas", f1d:"Escribe en español, árabe, inglés o cualquier idioma — se vuelve un prompt profesional preciso.",
    f2t:"Imágenes y video juntos", f2d:"Genera imágenes y video corto desde un solo lugar, una interfaz.",
    f3t:"Listo para redes", f3d:"Tamaños listos para Reels y publicaciones, sin recortes.",
    f4t:"Simple y profesional", f4d:"Una interfaz limpia centrada en la creatividad, no en la complejidad.",
    footer:"Estudio de IA para generar imágenes y video · Prototipo de interfaz" },

  de: { brand:"Tayf", nav:["Studio","Galerie","Funktionen"], login:"Anmelden",
    eyebrow:"KI-Studio · Neue Generation", h1a:"Von einem", h1g:"Wort", h1b:"zum Bild oder Video in Sekunden",
    subA:"Schreib deine Idee", subG:"in jeder Sprache", subB:"— die KI versteht sie und macht daraus professionellen Content für Reels und Posts.",
    image:"Bild", video:"Video",
    phImg:"z. B. Eine Weltraumkatze sitzt auf der Marsoberfläche und blickt zur fernen Erde, filmisches Licht...",
    phVid:"z. B. Ein Mädchen geht nachts eine regnerische Straße entlang, Neonlichter spiegeln sich am Boden, langsame Kamera...",
    enhance:"Prompt mit KI verbessern", enhancing:"Wird verbessert…", hint:"Macht aus deiner Idee einen detaillierten englischen Prompt für bessere Ergebnisse",
    errRetry:"Verbesserung fehlgeschlagen. Versuch es nochmal.", errConn:"KI-Dienst nicht erreichbar. Versuch es nochmal.",
    enhancedT:"Verbesserter Prompt", copy:"Kopieren", modelLabel:"Generierungsmodell", bRec:"Empfohlen", bVal:"Bestes Preis-Leistung",bCheap:"Am günstigsten",
    nVeo:"Natives synchrones Audio · am vollständigsten", nKling:"4K · 60fps · 15s · bestes Preis-Leistung", nSeed:"Beste Bewegung & Physik · API bald",nEco:"Günstig · für die kostenlose Testversion",locked:"Für Abos",
    durLabel:"Videodauer", sec:"Sek", styleLabel:"Stil",
    styles:{cinematic:"Filmisch",photoreal:"Fotorealistisch",anime:"Anime",td:"3D",neon:"Neon",minimal:"Minimal"},
    ratioLabel:"Seitenverhältnis", ratios:{reels:"Reels",square:"Quadrat",wide:"Breit",post:"Post"},
    countLabel:"Ergebnisse", genImg:"Bilder generieren", genVid:"Video generieren",
    empty:"Deine Ergebnisse erscheinen hier. Schreib eine Idee und drück „Generieren“.", result:"Ergebnisse",
    galTitle:"Beispiele, was du erstellen kannst", preview:"Vorschau", featTitle:"Warum Tayf",
    f1t:"Versteht jede Sprache", f1d:"Schreib auf Deutsch, Arabisch, Englisch oder jeder Sprache — es wird ein präziser Profi-Prompt.",
    f2t:"Bilder und Video zusammen", f2d:"Bilder und kurze Videos an einem Ort, eine Oberfläche.",
    f3t:"Social-ready", f3d:"Formate für Reels und Posts direkt fertig, kein Zuschneiden nötig.",
    f4t:"Einfach und professionell", f4d:"Eine klare Oberfläche, fokussiert auf Kreativität statt Komplexität.",
    footer:"KI-Studio für Bild- und Videogenerierung · UI-Prototyp" },

  ru: { brand:"Tayf", nav:["Студия","Галерея","Функции"], login:"Войти",
    eyebrow:"ИИ-студия · Новое поколение", h1a:"От", h1g:"слова", h1b:"до изображения или видео за секунды",
    subA:"Напишите свою идею", subG:"на любом языке", subB:"— ИИ поймёт её и превратит в профессиональный контент для Reels и постов.",
    image:"Изображение", video:"Видео",
    phImg:"напр. Космический кот сидит на поверхности Марса и смотрит на далёкую Землю, кинематографический свет...",
    phVid:"напр. Девушка идёт по дождливой улице ночью, неоновые огни отражаются на земле, медленное движение камеры...",
    enhance:"Улучшить промпт с ИИ", enhancing:"Улучшаем…", hint:"Превращает вашу идею в подробный английский промпт для лучших результатов",
    errRetry:"Не удалось улучшить. Попробуйте снова.", errConn:"Не удалось связаться с сервисом ИИ. Попробуйте снова.",
    enhancedT:"Улучшенный промпт", copy:"Копировать", modelLabel:"Модель генерации", bRec:"Рекомендуем", bVal:"Лучшая цена",bCheap:"Дешевле всего",
    nVeo:"Родной синхронный звук · самый полный", nKling:"4K · 60fps · 15s · лучшая цена", nSeed:"Лучшее движение и физика · API скоро",nEco:"Эконом · для бесплатного периода",locked:"По подписке",
    durLabel:"Длительность видео", sec:"сек", styleLabel:"Стиль",
    styles:{cinematic:"Кинематографичный",photoreal:"Реалистичный",anime:"Аниме",td:"3D",neon:"Неон",minimal:"Минимализм"},
    ratioLabel:"Соотношение сторон", ratios:{reels:"Reels",square:"Квадрат",wide:"Широкий",post:"Пост"},
    countLabel:"Результаты", genImg:"Создать изображения", genVid:"Создать видео",
    empty:"Здесь появятся ваши результаты. Напишите идею и нажмите «Создать».", result:"рез.",
    galTitle:"Примеры того, что можно создать", preview:"превью", featTitle:"Почему Tayf",
    f1t:"Понимает любой язык", f1d:"Пишите по-русски, по-арабски, по-английски или на любом языке — получится точный профи-промпт.",
    f2t:"Изображения и видео вместе", f2d:"Создавайте изображения и короткие видео в одном месте, один интерфейс.",
    f3t:"Готово для соцсетей", f3d:"Размеры готовы для Reels и постов сразу, без обрезки.",
    f4t:"Просто и профессионально", f4d:"Чистый интерфейс, сфокусированный на творчестве, а не на сложности.",
    footer:"ИИ-студия для генерации изображений и видео · Прототип интерфейса" },

  hi: { brand:"Tayf", nav:["स्टूडियो","गैलरी","विशेषताएँ"], login:"साइन इन",
    eyebrow:"एआई स्टूडियो · नई पीढ़ी", h1a:"एक", h1g:"शब्द", h1b:"से सेकंडों में तस्वीर या वीडियो तक",
    subA:"अपना विचार लिखें", subG:"किसी भी भाषा में", subB:"— एआई इसे समझता है और इसे Reels व पोस्ट के लिए पेशेवर कंटेंट में बदल देता है।",
    image:"तस्वीर", video:"वीडियो",
    phImg:"उदा. मंगल की सतह पर बैठी एक अंतरिक्ष बिल्ली दूर पृथ्वी को देखते हुए, सिनेमाई रोशनी...",
    phVid:"उदा. रात में बारिश वाली सड़क पर चलती एक लड़की, ज़मीन पर परावर्तित नियॉन रोशनी, धीमा कैमरा मूव...",
    enhance:"एआई से प्रॉम्प्ट बेहतर करें", enhancing:"बेहतर किया जा रहा है…", hint:"आपके विचार को मज़बूत नतीजों के लिए विस्तृत अंग्रेज़ी प्रॉम्प्ट में बदलता है",
    errRetry:"बेहतर नहीं हो सका। दोबारा कोशिश करें।", errConn:"एआई सेवा से संपर्क नहीं हो सका। दोबारा कोशिश करें।",
    enhancedT:"बेहतर प्रॉम्प्ट", copy:"कॉपी", modelLabel:"जनरेशन मॉडल", bRec:"अनुशंसित", bVal:"सर्वोत्तम मूल्य",bCheap:"सबसे सस्ता",
    nVeo:"नेटिव सिंक ऑडियो · सबसे संपूर्ण", nKling:"4K · 60fps · 15s · सर्वोत्तम मूल्य", nSeed:"सर्वश्रेष्ठ मोशन व फिज़िक्स · API जल्द",nEco:"किफ़ायती · मुफ़्त ट्रायल के लिए",locked:"सब्सक्राइबर",
    durLabel:"वीडियो अवधि", sec:"से", styleLabel:"शैली",
    styles:{cinematic:"सिनेमाई",photoreal:"यथार्थवादी",anime:"एनिमे",td:"3D",neon:"नियॉन",minimal:"मिनिमल"},
    ratioLabel:"आस्पेक्ट रेशियो", ratios:{reels:"Reels",square:"वर्ग",wide:"चौड़ा",post:"पोस्ट"},
    countLabel:"परिणाम", genImg:"तस्वीरें बनाएँ", genVid:"वीडियो बनाएँ",
    empty:"आपके परिणाम यहाँ दिखेंगे। एक विचार लिखें फिर «बनाएँ» दबाएँ।", result:"परिणाम",
    galTitle:"आप क्या बना सकते हैं इसके उदाहरण", preview:"पूर्वावलोकन", featTitle:"Tayf क्यों",
    f1t:"हर भाषा समझता है", f1d:"हिंदी, अरबी, अंग्रेज़ी या किसी भी भाषा में लिखें — यह सटीक पेशेवर प्रॉम्प्ट बन जाता है।",
    f2t:"तस्वीर और वीडियो साथ", f2d:"एक जगह, एक इंटरफ़ेस से तस्वीरें और छोटे वीडियो बनाएँ।",
    f3t:"सोशल के लिए तैयार", f3d:"Reels और पोस्ट के लिए साइज़ तैयार, क्रॉप की ज़रूरत नहीं।",
    f4t:"सरल और पेशेवर", f4d:"रचनात्मकता पर केंद्रित एक साफ़ इंटरफ़ेस, जटिलता पर नहीं।",
    footer:"तस्वीर व वीडियो जनरेशन के लिए एआई स्टूडियो · इंटरफ़ेस प्रोटोटाइप" },
};

// عدد ثواني الفيديو المجانية في التجربة
const FREE_SECONDS = 3;

// قاموس ترجمة الحسابات والتجربة المجانية
const AUTH = {
  ar:{su:"إنشاء حساب",li:"تسجيل الدخول",suSub:"أنشئ حسابك واحصل على تجربة مجانية",liSub:"مرحباً بعودتك",name:"الاسم",email:"البريد الإلكتروني",pass:"كلمة المرور",doSu:"إنشاء الحساب وبدء التجربة",doLi:"تسجيل الدخول",have:"لديك حساب؟ سجّل الدخول",no:"ليس لديك حساب؟ أنشئ واحداً",trial:"تجربة مجانية",credits:"رصيد",left:"رصيد مجاني متبقٍ",logout:"خروج",errFields:"يرجى ملء جميع الحقول",errEmail:"هذا البريد مسجّل بالفعل",errLogin:"البريد أو كلمة المرور غير صحيحة",noCredits:"انتهت تجربتك المجانية — اشترك للمتابعة",upgrade:"اشترِك",freeCta:"ابدأ التجربة المجانية",gate:"أنشئ حساباً لبدء تجربتك المجانية",demo:"نموذج تجريبي — في الإنتاج يجب أن تكون الحسابات وكلمات المرور على خادم آمن.",cost:"التكلفة",pricing:"اختر خطتك",mo:"/شهر",crM:"عملة شهرياً",pop:"الأكثر طلباً",allM:"كل النماذج مفتوحة",subOk:"أنت مشترك الآن ✓",p1:"بداية",p2:"احترافي",p3:"أعمال",close:"إغلاق"},
  en:{su:"Sign up",li:"Sign in",suSub:"Create your account and get a free trial",liSub:"Welcome back",name:"Name",email:"Email",pass:"Password",doSu:"Create account & start trial",doLi:"Sign in",have:"Have an account? Sign in",no:"No account? Create one",trial:"Free trial",credits:"Balance",left:"free credits left",logout:"Log out",errFields:"Please fill in all fields",errEmail:"This email is already registered",errLogin:"Email or password is incorrect",noCredits:"Your free trial is over — subscribe to continue",upgrade:"Upgrade",freeCta:"Start free trial",gate:"Create an account to start your free trial",demo:"Demo only — in production, accounts and passwords must live on a secure backend.",cost:"Cost",pricing:"Choose your plan",mo:"/mo",crM:"credits / month",pop:"Most popular",allM:"All models unlocked",subOk:"You're subscribed ✓",p1:"Starter",p2:"Pro",p3:"Business",close:"Close"},
  ku:{su:"دروستکردنی هەژمار",li:"چوونەژوورەوە",suSub:"هەژمارەکەت دروست بکە و تاقیکردنەوەی بەخۆڕایی بەدەست بهێنە",liSub:"بەخێربێیتەوە",name:"ناو",email:"ئیمەیڵ",pass:"تێپەڕەوشە",doSu:"دروستکردن و دەستپێکردنی تاقیکردنەوە",doLi:"چوونەژوورەوە",have:"هەژمارت هەیە؟ بچۆ ژوورەوە",no:"هەژمارت نییە؟ یەکێک دروست بکە",trial:"تاقیکردنەوەی بەخۆڕایی",credits:"باڵانس",left:"باڵانسی بەخۆڕایی ماوە",logout:"دەرچوون",errFields:"تکایە هەموو خانەکان پڕبکەرەوە",errEmail:"ئەم ئیمەیڵە پێشتر تۆمارکراوە",errLogin:"ئیمەیڵ یان تێپەڕەوشە هەڵەیە",noCredits:"تاقیکردنەوەی بەخۆڕاییت تەواوبوو — بەشداربە بۆ بەردەوامبوون",upgrade:"بەشداربە",freeCta:"دەستپێکردنی تاقیکردنەوەی بەخۆڕایی",gate:"هەژمارێک دروست بکە بۆ دەستپێکردنی تاقیکردنەوەکەت",demo:"تەنها نموونە — لە بەرهەمهێناندا دەبێت هەژمار و تێپەڕەوشە لەسەر سێرڤەری پارێزراو بن.",cost:"تێچوو",pricing:"پلانەکەت هەڵبژێرە",mo:"/مانگ",crM:"باڵانس مانگانە",pop:"زۆرترین داواکراو",allM:"هەموو مۆدێلەکان کراوەن",subOk:"ئێستا بەشداریت کردووە ✓",p1:"دەستپێک",p2:"پڕۆ",p3:"بزنس",close:"داخستن"},
  fa:{su:"ثبت‌نام",li:"ورود",suSub:"حساب بساز و نسخهٔ آزمایشی رایگان بگیر",liSub:"خوش آمدی",name:"نام",email:"ایمیل",pass:"رمز عبور",doSu:"ساخت حساب و شروع آزمایش",doLi:"ورود",have:"حساب داری؟ وارد شو",no:"حساب نداری؟ بساز",trial:"آزمایش رایگان",credits:"موجودی",left:"اعتبار رایگان باقی‌مانده",logout:"خروج",errFields:"لطفاً همهٔ فیلدها را پر کن",errEmail:"این ایمیل قبلاً ثبت شده",errLogin:"ایمیل یا رمز عبور نادرست است",noCredits:"آزمایش رایگانت تمام شد — برای ادامه اشتراک بگیر",upgrade:"ارتقا",freeCta:"شروع آزمایش رایگان",gate:"برای شروع آزمایش رایگان حساب بساز",demo:"فقط نمونه — در محصول واقعی حساب و رمز باید روی سرور امن باشند.",cost:"هزینه",pricing:"طرح خود را انتخاب کن",mo:"/ماه",crM:"اعتبار در ماه",pop:"محبوب‌ترین",allM:"همهٔ مدل‌ها باز",subOk:"اکنون مشترک شدی ✓",p1:"شروع",p2:"حرفه‌ای",p3:"تجاری",close:"بستن"},
  ur:{su:"اکاؤنٹ بنائیں",li:"سائن ان",suSub:"اکاؤنٹ بنائیں اور مفت ٹرائل حاصل کریں",liSub:"واپسی پر خوش آمدید",name:"نام",email:"ای میل",pass:"پاس ورڈ",doSu:"اکاؤنٹ بنا کر ٹرائل شروع کریں",doLi:"سائن ان",have:"اکاؤنٹ ہے؟ سائن ان کریں",no:"اکاؤنٹ نہیں؟ بنائیں",trial:"مفت ٹرائل",credits:"بیلنس",left:"مفت کریڈٹ باقی",logout:"لاگ آؤٹ",errFields:"براہ کرم تمام خانے پُر کریں",errEmail:"یہ ای میل پہلے سے رجسٹرڈ ہے",errLogin:"ای میل یا پاس ورڈ غلط ہے",noCredits:"آپ کا مفت ٹرائل ختم — جاری رکھنے کے لیے سبسکرائب کریں",upgrade:"اپ گریڈ",freeCta:"مفت ٹرائل شروع کریں",gate:"مفت ٹرائل شروع کرنے کے لیے اکاؤنٹ بنائیں",demo:"صرف نمونہ — اصل پروڈکٹ میں اکاؤنٹس اور پاس ورڈ محفوظ سرور پر ہونے چاہئیں۔",cost:"لاگت",pricing:"اپنا پلان منتخب کریں",mo:"/ماہ",crM:"کریڈٹ ماہانہ",pop:"سب سے مقبول",allM:"تمام ماڈلز کھلے",subOk:"اب آپ سبسکرائبڈ ہیں ✓",p1:"ابتدائی",p2:"پرو",p3:"بزنس",close:"بند کریں"},
  tr:{su:"Kayıt ol",li:"Giriş yap",suSub:"Hesabını oluştur ve ücretsiz deneme al",liSub:"Tekrar hoş geldin",name:"Ad",email:"E-posta",pass:"Şifre",doSu:"Hesap oluştur ve denemeyi başlat",doLi:"Giriş yap",have:"Hesabın var mı? Giriş yap",no:"Hesabın yok mu? Oluştur",trial:"Ücretsiz deneme",credits:"Bakiye",left:"ücretsiz kredi kaldı",logout:"Çıkış",errFields:"Lütfen tüm alanları doldur",errEmail:"Bu e-posta zaten kayıtlı",errLogin:"E-posta veya şifre yanlış",noCredits:"Ücretsiz denemen bitti — devam için abone ol",upgrade:"Yükselt",freeCta:"Ücretsiz denemeyi başlat",gate:"Ücretsiz denemeni başlatmak için hesap oluştur",demo:"Sadece demo — gerçek üründe hesaplar ve şifreler güvenli bir sunucuda olmalı.",cost:"Maliyet",pricing:"Planını seç",mo:"/ay",crM:"kredi / ay",pop:"En popüler",allM:"Tüm modeller açık",subOk:"Artık abonesin ✓",p1:"Başlangıç",p2:"Pro",p3:"İşletme",close:"Kapat"},
  fr:{su:"S'inscrire",li:"Se connecter",suSub:"Crée ton compte et obtiens un essai gratuit",liSub:"Bon retour",name:"Nom",email:"E-mail",pass:"Mot de passe",doSu:"Créer le compte et démarrer l'essai",doLi:"Se connecter",have:"Déjà un compte ? Connecte-toi",no:"Pas de compte ? Crées-en un",trial:"Essai gratuit",credits:"Solde",left:"crédits gratuits restants",logout:"Déconnexion",errFields:"Remplis tous les champs",errEmail:"Cet e-mail est déjà enregistré",errLogin:"E-mail ou mot de passe incorrect",noCredits:"Ton essai gratuit est terminé — abonne-toi pour continuer",upgrade:"Passer au pro",freeCta:"Démarrer l'essai gratuit",gate:"Crée un compte pour démarrer ton essai gratuit",demo:"Démo uniquement — en production, comptes et mots de passe doivent être sur un serveur sécurisé.",cost:"Coût",pricing:"Choisis ton offre",mo:"/mois",crM:"crédits / mois",pop:"Le plus populaire",allM:"Tous les modèles débloqués",subOk:"Tu es abonné ✓",p1:"Starter",p2:"Pro",p3:"Business",close:"Fermer"},
  es:{su:"Registrarse",li:"Iniciar sesión",suSub:"Crea tu cuenta y obtén una prueba gratis",liSub:"Bienvenido de nuevo",name:"Nombre",email:"Correo",pass:"Contraseña",doSu:"Crear cuenta e iniciar prueba",doLi:"Iniciar sesión",have:"¿Tienes cuenta? Inicia sesión",no:"¿Sin cuenta? Crea una",trial:"Prueba gratis",credits:"Saldo",left:"créditos gratis restantes",logout:"Cerrar sesión",errFields:"Completa todos los campos",errEmail:"Este correo ya está registrado",errLogin:"Correo o contraseña incorrectos",noCredits:"Tu prueba gratis terminó — suscríbete para continuar",upgrade:"Mejorar",freeCta:"Iniciar prueba gratis",gate:"Crea una cuenta para iniciar tu prueba gratis",demo:"Solo demo — en producción, cuentas y contraseñas deben estar en un backend seguro.",cost:"Costo",pricing:"Elige tu plan",mo:"/mes",crM:"créditos / mes",pop:"Más popular",allM:"Todos los modelos desbloqueados",subOk:"Ya estás suscrito ✓",p1:"Inicial",p2:"Pro",p3:"Empresa",close:"Cerrar"},
  de:{su:"Registrieren",li:"Anmelden",suSub:"Erstelle dein Konto und erhalte eine kostenlose Testversion",liSub:"Willkommen zurück",name:"Name",email:"E-Mail",pass:"Passwort",doSu:"Konto erstellen & Test starten",doLi:"Anmelden",have:"Konto vorhanden? Anmelden",no:"Kein Konto? Erstelle eins",trial:"Kostenlose Testversion",credits:"Guthaben",left:"kostenlose Credits übrig",logout:"Abmelden",errFields:"Bitte alle Felder ausfüllen",errEmail:"Diese E-Mail ist bereits registriert",errLogin:"E-Mail oder Passwort falsch",noCredits:"Deine Testversion ist vorbei — abonniere, um fortzufahren",upgrade:"Upgrade",freeCta:"Kostenlose Testversion starten",gate:"Erstelle ein Konto, um deine Testversion zu starten",demo:"Nur Demo — in Produktion müssen Konten und Passwörter auf einem sicheren Server liegen.",cost:"Kosten",pricing:"Wähle deinen Plan",mo:"/Monat",crM:"Credits / Monat",pop:"Am beliebtesten",allM:"Alle Modelle freigeschaltet",subOk:"Du bist abonniert ✓",p1:"Starter",p2:"Pro",p3:"Business",close:"Schließen"},
  ru:{su:"Регистрация",li:"Вход",suSub:"Создайте аккаунт и получите бесплатный пробный период",liSub:"С возвращением",name:"Имя",email:"Эл. почта",pass:"Пароль",doSu:"Создать аккаунт и начать пробу",doLi:"Войти",have:"Есть аккаунт? Войти",no:"Нет аккаунта? Создайте",trial:"Бесплатно",credits:"Баланс",left:"бесплатных кредитов осталось",logout:"Выйти",errFields:"Заполните все поля",errEmail:"Эта почта уже зарегистрирована",errLogin:"Неверная почта или пароль",noCredits:"Пробный период закончился — оформите подписку",upgrade:"Подписка",freeCta:"Начать бесплатно",gate:"Создайте аккаунт, чтобы начать бесплатный период",demo:"Только демо — в продакшене аккаунты и пароли должны храниться на защищённом сервере.",cost:"Стоимость",pricing:"Выберите план",mo:"/мес",crM:"кредитов / мес",pop:"Популярный",allM:"Все модели открыты",subOk:"Вы подписаны ✓",p1:"Старт",p2:"Про",p3:"Бизнес",close:"Закрыть"},
  hi:{su:"साइन अप",li:"साइन इन",suSub:"अपना अकाउंट बनाएँ और मुफ़्त ट्रायल पाएँ",liSub:"वापसी पर स्वागत है",name:"नाम",email:"ईमेल",pass:"पासवर्ड",doSu:"अकाउंट बनाएँ और ट्रायल शुरू करें",doLi:"साइन इन",have:"अकाउंट है? साइन इन करें",no:"अकाउंट नहीं? बनाएँ",trial:"मुफ़्त ट्रायल",credits:"बैलेंस",left:"मुफ़्त क्रेडिट शेष",logout:"लॉग आउट",errFields:"कृपया सभी फ़ील्ड भरें",errEmail:"यह ईमेल पहले से रजिस्टर है",errLogin:"ईमेल या पासवर्ड गलत है",noCredits:"आपका मुफ़्त ट्रायल खत्म — जारी रखने के लिए सब्सक्राइब करें",upgrade:"अपग्रेड",freeCta:"मुफ़्त ट्रायल शुरू करें",gate:"मुफ़्त ट्रायल शुरू करने के लिए अकाउंट बनाएँ",demo:"केवल डेमो — असली प्रोडक्ट में अकाउंट और पासवर्ड सुरक्षित सर्वर पर होने चाहिए।",cost:"लागत",pricing:"अपना प्लान चुनें",mo:"/माह",crM:"क्रेडिट / माह",pop:"सबसे लोकप्रिय",allM:"सभी मॉडल अनलॉक",subOk:"अब आप सब्सक्राइब्ड हैं ✓",p1:"स्टार्टर",p2:"प्रो",p3:"बिज़नेस",close:"बंद करें"},
};

const STYLE_IDS = [
  { id: "cinematic", k:"cinematic", en: "cinematic film still, dramatic lighting, 35mm, shallow depth of field" },
  { id: "photoreal", k:"photoreal", en: "ultra photorealistic, natural light, high detail, 50mm lens" },
  { id: "anime", k:"anime", en: "anime style, vibrant colors, clean lineart, studio quality" },
  { id: "3d", k:"td", en: "3D render, octane, soft global illumination, pixar-like" },
  { id: "neon", k:"neon", en: "neon cyberpunk, glowing lights, moody atmosphere, reflections" },
  { id: "minimal", k:"minimal", en: "minimalist, clean composition, soft pastel palette, lots of negative space" },
];

const RATIO_IDS = [
  { id: "9:16", k:"reels", w: 9, h: 16 },
  { id: "1:1", k:"square", w: 1, h: 1 },
  { id: "16:9", k:"wide", w: 16, h: 9 },
  { id: "4:5", k:"post", w: 4, h: 5 },
];

const VIDEO_MODELS = [
  { id: "kling26", label: "Kling 2.6", by: "Kuaishou", noteKey:"nEco", endpoint: "fal-ai/kling-video/v2.6/pro/text-to-video", badgeKey: "bCheap", mult: 1 },
  { id: "veo3.1", label: "Veo 3.1", by: "Google", noteKey:"nVeo", endpoint: "fal-ai/veo3.1/text-to-video", badgeKey: "bRec", mult: 6 },
  { id: "kling3", label: "Kling 3.0", by: "Kuaishou", noteKey:"nKling", endpoint: "fal-ai/kling-video/v3.0/text-to-video", badgeKey: "bVal", mult: 4 },
  { id: "seedance2", label: "Seedance 2.0", by: "ByteDance", noteKey:"nSeed", endpoint: "fal-ai/bytedance/seedance-v2/text-to-video", badgeKey: "", mult: 4 },
];

// نموذج التجربة المجانية (الأرخص). النماذج الأخرى تُفتح بالاشتراك.
const FREE_MODEL = "kling26";

// عنوان الخادم الخلفي (Render). يمكن تغييره لاحقاً من متغيّر بيئة Vite.
const API_BASE = (import.meta.env && import.meta.env.VITE_API_BASE) || "https://tayf-backend.onrender.com";

// طبقة تخزين متوافقة مع المتصفّح: تستخدم localStorage إن لم تتوفّر window.storage الخاصة بالمنصّة.
const storage = (typeof window !== "undefined" && window.storage) ? window.storage : {
  async get(key) {
    try { const v = localStorage.getItem(key); return v == null ? null : { key, value: v }; }
    catch (e) { return null; }
  },
  async set(key, value) { try { localStorage.setItem(key, value); } catch (e) {} return { key, value }; },
  async delete(key) { try { localStorage.removeItem(key); } catch (e) {} return { key }; },
};

// خطط الاشتراك — مصمّمة بهامش ربح (تكلفة العملة عليك ≈ ٠.٠٧ دولار)
const PLANS = [
  { id: "starter", nameKey: "p1", price: 15, credits: 60 },
  { id: "pro", nameKey: "p2", price: 39, credits: 200, popular: true },
  { id: "biz", nameKey: "p3", price: 99, credits: 600 },
];

// تسميات أزرار الحفظ والمعاينة بكل اللغات
const L_SAVE = { ar:"حفظ", en:"Save", ku:"پاشەکەوت", fa:"ذخیره", ur:"محفوظ کریں", tr:"Kaydet", fr:"Enregistrer", es:"Guardar", de:"Speichern", ru:"Скачать", hi:"सहेजें" };
const L_VIEW = { ar:"عرض بحجم كامل", en:"Full view", ku:"بینینی تەواو", fa:"نمایش کامل", ur:"مکمل دیکھیں", tr:"Tam görünüm", fr:"Plein écran", es:"Pantalla completa", de:"Vollansicht", ru:"Открыть", hi:"पूरा देखें" };
const L_DL = { ar:"تنزيل", en:"Download", ku:"داگرتن", fa:"دانلود", ur:"ڈاؤن لوڈ", tr:"İndir", fr:"Télécharger", es:"Descargar", de:"Herunterladen", ru:"Скачать", hi:"डाउनलोड" };

// قاموس نافذة الحساب (الملف الشخصي)
const ACCT = {
  ar:{ title:"حسابي", accountInfo:"معلومات الحساب", nameL:"الاسم", emailL:"البريد الإلكتروني", emailNote:"لا يمكن تغيير البريد حالياً", creditsL:"الرصيد", planL:"الخطة", free:"مجاني", subscribed:"مشترك", changePass:"تغيير كلمة المرور", curPass:"كلمة المرور الحالية", newPass:"كلمة المرور الجديدة", save:"حفظ التعديلات", saving:"جارٍ الحفظ…", saved:"تم حفظ التعديلات ✓", errSave:"تعذّر الحفظ، حاول مرة أخرى", errCur:"كلمة المرور الحالية غير صحيحة", errShortPass:"كلمة المرور الجديدة قصيرة جداً (٦ أحرف على الأقل)", errShortName:"الاسم قصير جداً", errCurReq:"أدخل كلمة المرور الحالية لتغييرها", nothing:"لم تغيّر أي شيء", close:"إغلاق" },
  en:{ title:"My account", accountInfo:"Account info", nameL:"Name", emailL:"Email", emailNote:"Email can't be changed for now", creditsL:"Balance", planL:"Plan", free:"Free", subscribed:"Subscribed", changePass:"Change password", curPass:"Current password", newPass:"New password", save:"Save changes", saving:"Saving…", saved:"Changes saved ✓", errSave:"Couldn't save, try again", errCur:"Current password is incorrect", errShortPass:"New password is too short (min 6 chars)", errShortName:"Name is too short", errCurReq:"Enter your current password to change it", nothing:"You didn't change anything", close:"Close" },
  ku:{ title:"هەژمارەکەم", accountInfo:"زانیاری هەژمار", nameL:"ناو", emailL:"ئیمەیڵ", emailNote:"ئێستا ناتوانرێت ئیمەیڵ بگۆڕدرێت", creditsL:"باڵانس", planL:"پلان", free:"بەخۆڕایی", subscribed:"بەشداربوو", changePass:"گۆڕینی تێپەڕەوشە", curPass:"تێپەڕەوشەی ئێستا", newPass:"تێپەڕەوشەی نوێ", save:"پاشەکەوتکردن", saving:"پاشەکەوت دەکرێت…", saved:"گۆڕانکارییەکان پاشەکەوتکران ✓", errSave:"پاشەکەوت نەکرا، دووبارە هەوڵبدە", errCur:"تێپەڕەوشەی ئێستا هەڵەیە", errShortPass:"تێپەڕەوشەی نوێ زۆر کورتە (لانیکەم ٦ پیت)", errShortName:"ناو زۆر کورتە", errCurReq:"تێپەڕەوشەی ئێستا بنووسە بۆ گۆڕینی", nothing:"هیچت نەگۆڕی", close:"داخستن" },
  fa:{ title:"حساب من", accountInfo:"اطلاعات حساب", nameL:"نام", emailL:"ایمیل", emailNote:"در حال حاضر ایمیل قابل تغییر نیست", creditsL:"موجودی", planL:"طرح", free:"رایگان", subscribed:"مشترک", changePass:"تغییر رمز عبور", curPass:"رمز عبور فعلی", newPass:"رمز عبور جدید", save:"ذخیره تغییرات", saving:"در حال ذخیره…", saved:"تغییرات ذخیره شد ✓", errSave:"ذخیره نشد، دوباره تلاش کن", errCur:"رمز عبور فعلی نادرست است", errShortPass:"رمز جدید خیلی کوتاه است (حداقل ۶ نویسه)", errShortName:"نام خیلی کوتاه است", errCurReq:"رمز فعلی را برای تغییر وارد کن", nothing:"چیزی تغییر ندادی", close:"بستن" },
  ur:{ title:"میرا اکاؤنٹ", accountInfo:"اکاؤنٹ معلومات", nameL:"نام", emailL:"ای میل", emailNote:"فی الحال ای میل تبدیل نہیں ہو سکتا", creditsL:"بیلنس", planL:"پلان", free:"مفت", subscribed:"سبسکرائبڈ", changePass:"پاس ورڈ تبدیل کریں", curPass:"موجودہ پاس ورڈ", newPass:"نیا پاس ورڈ", save:"تبدیلیاں محفوظ کریں", saving:"محفوظ ہو رہا ہے…", saved:"تبدیلیاں محفوظ ہو گئیں ✓", errSave:"محفوظ نہ ہو سکا، دوبارہ کوشش کریں", errCur:"موجودہ پاس ورڈ غلط ہے", errShortPass:"نیا پاس ورڈ بہت چھوٹا ہے (کم از کم ۶ حروف)", errShortName:"نام بہت چھوٹا ہے", errCurReq:"تبدیل کرنے کے لیے موجودہ پاس ورڈ درج کریں", nothing:"آپ نے کچھ تبدیل نہیں کیا", close:"بند کریں" },
  tr:{ title:"Hesabım", accountInfo:"Hesap bilgileri", nameL:"Ad", emailL:"E-posta", emailNote:"E-posta şu an değiştirilemez", creditsL:"Bakiye", planL:"Plan", free:"Ücretsiz", subscribed:"Abone", changePass:"Şifre değiştir", curPass:"Mevcut şifre", newPass:"Yeni şifre", save:"Değişiklikleri kaydet", saving:"Kaydediliyor…", saved:"Değişiklikler kaydedildi ✓", errSave:"Kaydedilemedi, tekrar dene", errCur:"Mevcut şifre yanlış", errShortPass:"Yeni şifre çok kısa (en az 6 karakter)", errShortName:"Ad çok kısa", errCurReq:"Değiştirmek için mevcut şifreni gir", nothing:"Hiçbir şey değiştirmedin", close:"Kapat" },
  fr:{ title:"Mon compte", accountInfo:"Infos du compte", nameL:"Nom", emailL:"E-mail", emailNote:"L'e-mail ne peut pas être modifié pour l'instant", creditsL:"Solde", planL:"Offre", free:"Gratuit", subscribed:"Abonné", changePass:"Changer le mot de passe", curPass:"Mot de passe actuel", newPass:"Nouveau mot de passe", save:"Enregistrer", saving:"Enregistrement…", saved:"Modifications enregistrées ✓", errSave:"Échec de l'enregistrement, réessaie", errCur:"Mot de passe actuel incorrect", errShortPass:"Nouveau mot de passe trop court (min 6 caractères)", errShortName:"Nom trop court", errCurReq:"Saisis ton mot de passe actuel pour le changer", nothing:"Tu n'as rien changé", close:"Fermer" },
  es:{ title:"Mi cuenta", accountInfo:"Información de la cuenta", nameL:"Nombre", emailL:"Correo", emailNote:"El correo no se puede cambiar por ahora", creditsL:"Saldo", planL:"Plan", free:"Gratis", subscribed:"Suscrito", changePass:"Cambiar contraseña", curPass:"Contraseña actual", newPass:"Nueva contraseña", save:"Guardar cambios", saving:"Guardando…", saved:"Cambios guardados ✓", errSave:"No se pudo guardar, inténtalo de nuevo", errCur:"La contraseña actual es incorrecta", errShortPass:"La nueva contraseña es muy corta (mín 6 caracteres)", errShortName:"El nombre es muy corto", errCurReq:"Introduce tu contraseña actual para cambiarla", nothing:"No cambiaste nada", close:"Cerrar" },
  de:{ title:"Mein Konto", accountInfo:"Kontoinfo", nameL:"Name", emailL:"E-Mail", emailNote:"E-Mail kann derzeit nicht geändert werden", creditsL:"Guthaben", planL:"Tarif", free:"Kostenlos", subscribed:"Abonniert", changePass:"Passwort ändern", curPass:"Aktuelles Passwort", newPass:"Neues Passwort", save:"Änderungen speichern", saving:"Wird gespeichert…", saved:"Änderungen gespeichert ✓", errSave:"Speichern fehlgeschlagen, versuch es nochmal", errCur:"Aktuelles Passwort ist falsch", errShortPass:"Neues Passwort zu kurz (min. 6 Zeichen)", errShortName:"Name zu kurz", errCurReq:"Gib dein aktuelles Passwort ein, um es zu ändern", nothing:"Du hast nichts geändert", close:"Schließen" },
  ru:{ title:"Мой аккаунт", accountInfo:"Данные аккаунта", nameL:"Имя", emailL:"Эл. почта", emailNote:"Почту пока нельзя изменить", creditsL:"Баланс", planL:"План", free:"Бесплатно", subscribed:"Подписка", changePass:"Сменить пароль", curPass:"Текущий пароль", newPass:"Новый пароль", save:"Сохранить", saving:"Сохранение…", saved:"Изменения сохранены ✓", errSave:"Не удалось сохранить, попробуйте снова", errCur:"Текущий пароль неверный", errShortPass:"Новый пароль слишком короткий (мин. 6 символов)", errShortName:"Имя слишком короткое", errCurReq:"Введите текущий пароль, чтобы сменить его", nothing:"Вы ничего не изменили", close:"Закрыть" },
  hi:{ title:"मेरा अकाउंट", accountInfo:"अकाउंट जानकारी", nameL:"नाम", emailL:"ईमेल", emailNote:"फ़िलहाल ईमेल नहीं बदल सकते", creditsL:"बैलेंस", planL:"प्लान", free:"मुफ़्त", subscribed:"सब्सक्राइब्ड", changePass:"पासवर्ड बदलें", curPass:"मौजूदा पासवर्ड", newPass:"नया पासवर्ड", save:"बदलाव सहेजें", saving:"सहेजा जा रहा है…", saved:"बदलाव सहेजे गए ✓", errSave:"सहेजा नहीं जा सका, फिर कोशिश करें", errCur:"मौजूदा पासवर्ड गलत है", errShortPass:"नया पासवर्ड बहुत छोटा है (कम से कम 6 अक्षर)", errShortName:"नाम बहुत छोटा है", errCurReq:"बदलने के लिए मौजूदा पासवर्ड डालें", nothing:"आपने कुछ नहीं बदला", close:"बंद करें" },
};

export default function App() {
  const [lang, setLang] = useState("ar");
  const [langOpen, setLangOpen] = useState(false);
  const [mode, setMode] = useState("image");
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("cinematic");
  const [ratio, setRatio] = useState("9:16");
  const [count, setCount] = useState(4);
  const [vModel, setVModel] = useState(FREE_MODEL);
  const [duration, setDuration] = useState(10);
  const [enhancing, setEnhancing] = useState(false);
  const [enhanced, setEnhanced] = useState("");
  const [enhanceErr, setEnhanceErr] = useState("");
  const [generated, setGenerated] = useState(null);
  const [token, setToken] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [genErr, setGenErr] = useState("");
  const [authBusy, setAuthBusy] = useState(false);
  const [authNote, setAuthNote] = useState("");
  const [lightbox, setLightbox] = useState(null); // معاينة بحجم كامل {url, mode}
  // ---- نافذة الحساب (الملف الشخصي) ----
  const [acctOpen, setAcctOpen] = useState(false);
  const [acctName, setAcctName] = useState("");
  const [acctCurPass, setAcctCurPass] = useState("");
  const [acctNewPass, setAcctNewPass] = useState("");
  const [acctBusy, setAcctBusy] = useState(false);
  const [acctErr, setAcctErr] = useState("");
  const [acctOk, setAcctOk] = useState("");
  const taRef = useRef(null);

  // فتح ملف (صورة/فيديو) عبر الخادم كتنزيل مضمون باسم نظيف
  function downloadOutput(url) {
    const name = "tayf-" + Date.now();
    const dl = API_BASE + "/api/download?url=" + encodeURIComponent(url) + "&name=" + encodeURIComponent(name);
    const link = document.createElement("a");
    link.href = dl;
    link.rel = "noopener";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // ---- الحسابات والتجربة المجانية ----
  const [user, setUser] = useState(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("signup");
  const [fName, setFName] = useState("");
  const [fEmail, setFEmail] = useState("");
  const [fPass, setFPass] = useState("");
  const [authErr, setAuthErr] = useState("");
  const [noCredit, setNoCredit] = useState(false);
  const a = AUTH[lang];
  const ac = ACCT[lang];

  // تحميل الجلسة المحفوظة (التوكن والمستخدم) ثم تحديث الرصيد من الخادم
  useEffect(() => {
    (async () => {
      let savedToken = null, savedUser = null;
      try {
        const ses = await storage.get("tayf:session");
        if (ses?.value) {
          const parsed = JSON.parse(ses.value);
          savedToken = parsed.token || null;
          savedUser = parsed.user || null;
        }
      } catch (e) {}
      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(savedUser);
        // تحديث الرصيد الفعلي من الخادم
        try {
          const r = await fetch(API_BASE + "/api/me", {
            headers: { Authorization: "Bearer " + savedToken },
          });
          if (r.ok) {
            const d = await r.json();
            if (d.user) setUser(d.user);
          } else if (r.status === 401) {
            // توكن منتهٍ — تنظيف
            setToken(null); setUser(null);
            try { await storage.delete("tayf:session"); } catch (e) {}
          }
        } catch (e) {}
      }
    })();
  }, []);

  function hash(str) {
    let h = 5381;
    for (let i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) >>> 0;
    return "h" + h.toString(36);
  }

  // حفظ الجلسة (التوكن + المستخدم) في التخزين المحلي
  async function saveSession(tok, u) {
    setToken(tok); setUser(u);
    try {
      if (tok && u) await storage.set("tayf:session", JSON.stringify({ token: tok, user: u }));
      else await storage.delete("tayf:session");
    } catch (e) {}
  }

  function openAuth(mode) {
    setAuthMode(mode); setAuthErr(""); setNoCredit(false); setAuthNote("");
    setFName(""); setFEmail(""); setFPass(""); setAuthOpen(true);
  }

  async function submitAuth() {
    if (authBusy) return;
    setAuthErr(""); setAuthNote("");
    const email = fEmail.trim().toLowerCase();
    if (authMode === "signup") {
      if (!fName.trim() || !email || !fPass) { setAuthErr(a.errFields); return; }
    } else {
      if (!email || !fPass) { setAuthErr(a.errFields); return; }
    }
    setAuthBusy(true);
    try {
      if (authMode === "signup") {
        const r = await fetch(API_BASE + "/api/signup", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: fName.trim(), email, password: fPass }),
        });
        const d = await r.json().catch(() => ({}));
        if (!r.ok) {
          if (d.error === "EMAIL_EXISTS") setAuthErr(a.errEmail);
          else if (d.error === "DISPOSABLE_EMAIL") setAuthErr(a.errEmail);
          else setAuthErr(a.errFields);
          return;
        }
        // الخادم أرسل بريد تأكيد — لا يوجد رصيد قبل التأكيد
        setAuthNote(a.verifySent || "تم إرسال رابط التأكيد إلى بريدك. فعّل حسابك ثم سجّل الدخول.");
      } else {
        const r = await fetch(API_BASE + "/api/login", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password: fPass }),
        });
        const d = await r.json().catch(() => ({}));
        if (!r.ok) {
          if (d.error === "EMAIL_NOT_VERIFIED") setAuthErr(a.notVerified || "فعّل بريدك أولاً عبر الرابط المُرسل.");
          else setAuthErr(a.errLogin);
          return;
        }
        await saveSession(d.token, d.user);
        setAuthOpen(false);
      }
    } catch (e) {
      setAuthErr(t.errConn || "تعذّر الاتصال بالخادم.");
    } finally {
      setAuthBusy(false);
    }
  }

  function logout() { saveSession(null, null); }

  // فتح نافذة الحساب وتعبئتها بالاسم الحالي
  function openAcct() {
    setAcctName(user?.name || "");
    setAcctCurPass(""); setAcctNewPass("");
    setAcctErr(""); setAcctOk("");
    setAcctOpen(true);
  }

  // حفظ تعديلات الحساب (الاسم و/أو كلمة المرور) عبر /api/profile
  async function saveAcct() {
    if (acctBusy) return;
    setAcctErr(""); setAcctOk("");
    const nameChanged = acctName.trim() && acctName.trim() !== (user?.name || "");
    const wantsPass = !!acctNewPass;
    if (!nameChanged && !wantsPass) { setAcctErr(ac.nothing); return; }
    if (nameChanged && acctName.trim().length < 2) { setAcctErr(ac.errShortName); return; }
    if (wantsPass) {
      if (!acctCurPass) { setAcctErr(ac.errCurReq); return; }
      if (acctNewPass.length < 6) { setAcctErr(ac.errShortPass); return; }
    }
    setAcctBusy(true);
    try {
      const body = {};
      if (nameChanged) body.name = acctName.trim();
      if (wantsPass) { body.currentPassword = acctCurPass; body.newPassword = acctNewPass; }
      const r = await fetch(API_BASE + "/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
        body: JSON.stringify(body),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) {
        if (d.error === "WRONG_CURRENT_PASSWORD") setAcctErr(ac.errCur);
        else if (d.error === "PASSWORD_TOO_SHORT") setAcctErr(ac.errShortPass);
        else if (d.error === "NAME_TOO_SHORT") setAcctErr(ac.errShortName);
        else if (d.error === "CURRENT_PASSWORD_REQUIRED") setAcctErr(ac.errCurReq);
        else if (d.error === "NOTHING_TO_UPDATE") setAcctErr(ac.nothing);
        else setAcctErr(ac.errSave);
        return;
      }
      // نجح: نحدّث الجلسة بالتوكن والمستخدم الجديد
      await saveSession(d.token || token, d.user);
      setAcctOk(ac.saved);
      setAcctCurPass(""); setAcctNewPass("");
    } catch (e) {
      setAcctErr(ac.errSave);
    } finally {
      setAcctBusy(false);
    }
  }

  // الاشتراك: حالياً تجريبي على الواجهة (الدفع الحقيقي لاحقاً)
  const [plansOpen, setPlansOpen] = useState(false);
  function subscribe(plan) {
    if (!user) { setPlansOpen(false); openAuth("signup"); return; }
    setUser({ ...user, subscribed: true, plan: plan.id });
    setPlansOpen(false); setNoCredit(false);
  }
  function openPlans() { if (!user) { openAuth("signup"); } else { setPlansOpen(true); } }

  const t = T[lang];
  const dir = LANGS.find((l) => l.code === lang)?.dir || "rtl";
  const reduce = typeof window !== "undefined" &&
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  async function enhance() {
    if (!prompt.trim() || enhancing) return;
    setEnhancing(true); setEnhanceErr(""); setEnhanced("");
    const styleEn = STYLE_IDS.find((s) => s.id === style)?.en || "";
    try {
      const res = await fetch(API_BASE + "/api/enhance", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim(), mode, styleEn }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.enhanced) setEnhanced(data.enhanced);
      else setEnhanceErr(t.errRetry);
    } catch (e) { setEnhanceErr(t.errConn); }
    finally { setEnhancing(false); }
  }

  // الرصيد يأتي من الخادم (user.credits). قبل الدخول نعرض رصيد التجربة كتلميح.
  const freeLeft = user ? (user.credits ?? 0) : FREE_SECONDS;
  // التجربة المجانية مقيّدة بالنموذج الأرخص؛ النماذج الأخرى للمشتركين
  const isFree = user ? !user.subscribed : true;
  const effModel = isFree ? FREE_MODEL : vModel;
  const modelMult = VIDEO_MODELS.find((m) => m.id === effModel)?.mult || 1;
  const countMax = mode === "video" ? 2 : Math.min(4, Math.max(1, freeLeft));
  const effCount = Math.min(count, countMax);
  const perVideoUnit = Math.max(1, effCount * modelMult);
  const vMax = Math.min(15, Math.max(3, Math.floor(freeLeft / perVideoUnit)));
  const dDur = Math.min(duration, vMax);
  const cost = mode === "video" ? effCount * dDur * modelMult : effCount;

  async function generate() {
    if (!user || !token) { openAuth("signup"); return; }
    if (!prompt.trim()) { taRef.current && taRef.current.focus(); return; }
    if (generating) return;
    if (freeLeft < cost) { setNoCredit(true); return; }
    setGenerating(true); setGenErr(""); setGenerated(null);
    const r = RATIO_IDS.find((x) => x.id === ratio);
    try {
      const res = await fetch(API_BASE + "/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
        body: JSON.stringify({
          mode,
          model: effModel,
          prompt: enhanced || prompt.trim(),
          ratio,
          duration: dDur,
          count: effCount,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (data.error === "INSUFFICIENT_CREDITS") { setNoCredit(true); }
        else if (res.status === 401) { setGenErr(t.errConn || "انتهت الجلسة، سجّل الدخول من جديد."); logout(); }
        else { setGenErr(t.errRetry || "تعذّر التوليد، حاول مرة أخرى."); }
        return;
      }
      const outputs = data.outputs || [];
      setGenerated({
        mode, ratio: r, count: outputs.length || effCount, duration: dDur,
        style: t.styles[STYLE_IDS.find((s) => s.id === style)?.k],
        prompt: enhanced || prompt, stamp: Date.now(),
        outputs,
      });
      // تحديث الرصيد من رد الخادم
      if (typeof data.creditsLeft === "number") {
        const nu = { ...user, credits: data.creditsLeft };
        setUser(nu);
        try { await storage.set("tayf:session", JSON.stringify({ token, user: nu })); } catch (e) {}
      }
    } catch (e) {
      setGenErr(t.errConn || "تعذّر الاتصال بالخادم.");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div dir={dir} className="tayf-root" lang={lang}>
      <style>{CSS}</style>

      <div className="wavebg" aria-hidden="true" />
      <div className="aurora" aria-hidden="true">
        <span className={"blob b1" + (reduce ? " still" : "")} />
        <span className={"blob b2" + (reduce ? " still" : "")} />
        <span className={"blob b3" + (reduce ? " still" : "")} />
        <span className={"blob b4" + (reduce ? " still" : "")} />
      </div>

      <header className="topbar">
        <div className="brand">
          <span className="mark" aria-hidden="true" />
          <span className="brandname">{t.brand}</span>
        </div>
        <nav className="nav">
          <a href="#studio">{t.nav[0]}</a>
          <a href="#gallery">{t.nav[1]}</a>
          <a href="#features">{t.nav[2]}</a>
        </nav>

        {/* مبدّل اللغة */}
        <div className="lang-wrap">
          <button className="lang-btn" onClick={() => setLangOpen((v) => !v)} aria-expanded={langOpen}>
            <IconGlobe />
            {LANGS.find((l) => l.code === lang)?.name}
            <IconChevron />
          </button>
          {langOpen && (
            <div className="lang-menu">
              {LANGS.map((l) => (
                <button key={l.code}
                  className={"lang-item " + (lang === l.code ? "on" : "")}
                  onClick={() => { setLang(l.code); setLangOpen(false); }}>
                  {l.name}
                </button>
              ))}
            </div>
          )}
        </div>
        {user ? (
          <div className="acct">
            <span className="acct-credits" title={a.credits}>
              <IconSpark /> {user.credits ?? 0} {a.left}
            </span>
            <button className="acct-name" onClick={openAcct} title={ac.title}>{user.name}</button>
            {user.subscribed && <span className="acct-sub" title={a.subOk}>✓</span>}
            <button className="ghost-btn small" onClick={logout}>{a.logout}</button>
          </div>
        ) : (
          <button className="ghost-btn" onClick={() => openAuth("login")}>{a.li}</button>
        )}
      </header>

      <main>
        <section className="hero">
          <span className="eyebrow">{t.eyebrow}</span>
          <h1>{t.h1a} <span className="grad">{t.h1g}</span> {t.h1b}</h1>
          <p className="sub">{t.subA} <span className="grad">{t.subG}</span> {t.subB}</p>
          {!user && (
            <button className="trial-cta" onClick={() => openAuth("signup")}>
              <IconSpark /> {a.freeCta}
            </button>
          )}
        </section>

        <section id="studio" className="studio">
          <div className="mode-row">
            <button className={"mode " + (mode === "image" ? "on" : "")} onClick={() => setMode("image")}>
              <IconImage /> {t.image}
            </button>
            <button className={"mode " + (mode === "video" ? "on" : "")} onClick={() => setMode("video")}>
              <IconVideo /> {t.video}
            </button>
          </div>

          <div className="prompt-box">
            <textarea ref={taRef} value={prompt} onChange={(e) => setPrompt(e.target.value)}
              placeholder={mode === "video" ? t.phVid : t.phImg} rows={3} />
            <div className="prompt-actions">
              <button className="enhance" onClick={enhance} disabled={enhancing || !prompt.trim()}>
                <IconSpark />{enhancing ? t.enhancing : t.enhance}
              </button>
              <span className="hint">{t.hint}</span>
            </div>
            {enhanceErr && <div className="err">{enhanceErr}</div>}
            {enhanced && (
              <div className="enhanced">
                <div className="enhanced-head">
                  <span><IconSpark /> {t.enhancedT}</span>
                  <button className="copy" onClick={() => navigator.clipboard?.writeText(enhanced)}>{t.copy}</button>
                </div>
                <p dir="ltr">{enhanced}</p>
              </div>
            )}
          </div>

          {mode === "video" && (
            <div className="control-group">
              <label className="ctl-label">{t.modelLabel}</label>
              <div className="models">
                {VIDEO_MODELS.map((m) => {
                  const locked = isFree && m.id !== FREE_MODEL;
                  const on = effModel === m.id;
                  return (
                    <button key={m.id}
                      className={"model " + (on ? "on " : "") + (locked ? "locked" : "")}
                      onClick={() => { if (locked) openPlans(); else setVModel(m.id); }}>
                      <span className="model-top">
                        <span className="model-name">{m.label}</span>
                        {locked
                          ? <span className="model-lock">🔒 {t.locked}</span>
                          : (m.badgeKey && <span className="model-badge">{t[m.badgeKey]}</span>)}
                      </span>
                      <span className="model-by">{m.by}</span>
                      <span className="model-note">{t[m.noteKey]}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {mode === "video" && (
            <div className="control-group">
              <label className="ctl-label">{t.durLabel} · {dDur} {t.sec}</label>
              <input type="range" min={3} max={vMax} step={1} value={dDur}
                onChange={(e) => setDuration(Number(e.target.value))} className="range" />
              <div className="range-ticks">
                <span>3{t.sec}</span><span>{vMax}{t.sec}</span>
              </div>
            </div>
          )}

          <div className="control-group">
            <label className="ctl-label">{t.styleLabel}</label>
            <div className="chips">
              {STYLE_IDS.map((s) => (
                <button key={s.id} className={"chip " + (style === s.id ? "on" : "")}
                  onClick={() => setStyle(s.id)}>{t.styles[s.k]}</button>
              ))}
            </div>
          </div>

          <div className="control-grid">
            <div className="control-group">
              <label className="ctl-label">{t.ratioLabel}</label>
              <div className="chips">
                {RATIO_IDS.map((r) => (
                  <button key={r.id} className={"chip " + (ratio === r.id ? "on" : "")}
                    onClick={() => setRatio(r.id)}>{t.ratios[r.k]} {r.id}</button>
                ))}
              </div>
            </div>
            <div className="control-group">
              <label className="ctl-label">{t.countLabel} · {effCount}</label>
              <input type="range" min={1} max={countMax} value={effCount}
                onChange={(e) => setCount(Number(e.target.value))} className="range" />
            </div>
          </div>

          <button className="generate" onClick={generate} disabled={generating}
            style={generating ? { opacity: 0.75, cursor: "wait" } : null}>
            <IconBolt />{generating ? (t.generating || "جارٍ التوليد…") : (mode === "video" ? t.genVid : t.genImg)}
          </button>

          {generating && (
            <div className="cost-hint">
              <IconSpark /> {t.genWait || "قد يستغرق التوليد بعض الوقت، خاصةً للفيديو — يرجى الانتظار."}
            </div>
          )}

          {genErr && (
            <div className="nocredit"><span>{genErr}</span></div>
          )}

          {user && !noCredit && (
            <div className="cost-hint">
              <IconSpark /> {a.cost}: {cost} · {freeLeft} {a.left}
            </div>
          )}

          {noCredit && (
            <div className="nocredit">
              <span>{a.noCredits}</span>
              <button className="upgrade" onClick={openPlans}>{a.upgrade}</button>
            </div>
          )}

          <div className="results">
            {!generated && <div className="empty">{t.empty}</div>}
            {generated && (
              <>
                <div className="results-meta">
                  <span>{generated.style}</span><span>·</span>
                  <span>{t.ratios[generated.ratio.k]} {generated.ratio.id}</span>
                  {generated.mode === "video" && (<><span>·</span><span>{generated.duration} {t.sec}</span></>)}
                  <span>·</span><span>{generated.count} {t.result}</span>
                </div>
                <div className="grid">
                  {(generated.outputs && generated.outputs.length
                    ? generated.outputs
                    : Array.from({ length: generated.count })
                  ).map((out, i) => (
                    <div key={i} className="card"
                      style={{ aspectRatio: generated.ratio.w + "/" + generated.ratio.h }}>
                      <div className="card-glow" />
                      {out ? (
                        <>
                          {generated.mode === "video" ? (
                            <video src={out} controls playsInline
                              style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "inherit" }} />
                          ) : (
                            <img src={out} alt={"result " + (i + 1)}
                              onClick={() => setLightbox({ url: out, mode: "image" })}
                              style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "inherit", cursor: "zoom-in" }} />
                          )}
                          <div className="card-actions">
                            <button className="card-act" title={L_VIEW[lang] || L_VIEW.ar}
                              onClick={() => setLightbox({ url: out, mode: generated.mode })}>
                              <IconExpand />
                            </button>
                            <button className="card-act" title={L_SAVE[lang] || L_SAVE.ar}
                              onClick={() => downloadOutput(out)}>
                              <IconDownload />
                            </button>
                          </div>
                        </>
                      ) : (
                        generated.mode === "video" ? <IconVideo /> : <IconImage />
                      )}
                      <span className="card-num">{i + 1}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>

        <section id="gallery" className="gallery">
          <h2>{t.galTitle}</h2>
          <div className="gal-grid">
            {GAL.map((g, i) => (
              <div key={i} className="gal" style={{ background: g }}>
                <span className="gal-tag">{t.preview}</span>
              </div>
            ))}
          </div>
        </section>

        <section id="features" className="features">
          <h2>{t.featTitle}</h2>
          <div className="feat-grid">
            <Feature icon={<IconSpark />} title={t.f1t}>{t.f1d}</Feature>
            <Feature icon={<IconVideo />} title={t.f2t}>{t.f2d}</Feature>
            <Feature icon={<IconLayers />} title={t.f3t}>{t.f3d}</Feature>
            <Feature icon={<IconShield />} title={t.f4t}>{t.f4d}</Feature>
          </div>
        </section>

        <footer className="footer">
          <span className="brandname small">{t.brand}</span>
          <p>{t.footer}</p>
        </footer>
      </main>

      {/* نافذة الحساب */}
      {authOpen && (
        <div className="modal-overlay" onClick={() => setAuthOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setAuthOpen(false)} aria-label={a.close}>×</button>
            {authMode === "signup" && <span className="modal-trial"><IconSpark /> {a.trial}</span>}
            <h2 className="modal-title">{authMode === "signup" ? a.su : a.li}</h2>
            <p className="modal-sub">{authMode === "signup" ? a.suSub : a.liSub}</p>

            <div className="fields">
              {authMode === "signup" && (
                <input className="field" placeholder={a.name} value={fName}
                  onChange={(e) => setFName(e.target.value)} />
              )}
              <input className="field" type="email" placeholder={a.email} value={fEmail}
                onChange={(e) => setFEmail(e.target.value)} dir="ltr" />
              <input className="field" type="password" placeholder={a.pass} value={fPass}
                onChange={(e) => setFPass(e.target.value)} dir="ltr"
                onKeyDown={(e) => e.key === "Enter" && submitAuth()} />
            </div>

            {authErr && <div className="err">{authErr}</div>}
            {authNote && <div className="cost-hint" style={{ marginTop: 10 }}><IconSpark /> {authNote}</div>}

            <button className="modal-submit" onClick={submitAuth} disabled={authBusy}
              style={authBusy ? { opacity: 0.75, cursor: "wait" } : null}>
              {authBusy ? "…" : (authMode === "signup" ? a.doSu : a.doLi)}
            </button>

            <button className="modal-toggle"
              onClick={() => { setAuthMode(authMode === "signup" ? "login" : "signup"); setAuthErr(""); setAuthNote(""); }}>
              {authMode === "signup" ? a.have : a.no}
            </button>

            <p className="modal-demo">{a.demo}</p>
          </div>
        </div>
      )}

      {/* نافذة خطط الأسعار */}
      {plansOpen && (
        <div className="modal-overlay" onClick={() => setPlansOpen(false)}>
          <div className="modal plans-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setPlansOpen(false)} aria-label={a.close}>×</button>
            <h2 className="modal-title">{a.pricing}</h2>
            <div className="plans">
              {PLANS.map((p) => (
                <div key={p.id} className={"plan " + (p.popular ? "popular" : "")}>
                  {p.popular && <span className="plan-pop">{a.pop}</span>}
                  <span className="plan-name">{a[p.nameKey]}</span>
                  <span className="plan-price">${p.price}<small>{a.mo}</small></span>
                  <span className="plan-credits">{p.credits} {a.crM}</span>
                  <span className="plan-feature">✓ {a.allM}</span>
                  <button className="plan-btn" onClick={() => subscribe(p)}>{a.upgrade}</button>
                </div>
              ))}
            </div>
            <p className="modal-demo">{a.demo}</p>
          </div>
        </div>
      )}

      {/* معاينة بحجم كامل (صورة/فيديو) */}
      {lightbox && (
        <div className="lb-overlay" onClick={() => setLightbox(null)}>
          <button className="lb-close" onClick={() => setLightbox(null)} aria-label={a.close}>×</button>
          <div className="lb-stage" onClick={(e) => e.stopPropagation()}>
            {lightbox.mode === "video" ? (
              <video src={lightbox.url} controls autoPlay playsInline className="lb-media" />
            ) : (
              <img src={lightbox.url} alt="full preview" className="lb-media" />
            )}
            <button className="lb-download" onClick={() => downloadOutput(lightbox.url)}>
              <IconDownload /> {L_DL[lang] || L_DL.ar}
            </button>
          </div>
        </div>
      )}

      {/* نافذة الحساب (الملف الشخصي) */}
      {acctOpen && (
        <div className="modal-overlay" onClick={() => setAcctOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setAcctOpen(false)} aria-label={ac.close}>×</button>
            <h2 className="modal-title">{ac.title}</h2>

            {/* معلومات الحساب */}
            <div className="acct-info">
              <div className="acct-row">
                <span className="acct-row-label">{ac.emailL}</span>
                <span className="acct-row-value" dir="ltr">{user?.email}</span>
              </div>
              <div className="acct-row">
                <span className="acct-row-label">{ac.creditsL}</span>
                <span className="acct-row-value">{user?.credits ?? 0}</span>
              </div>
              <div className="acct-row">
                <span className="acct-row-label">{ac.planL}</span>
                <span className="acct-row-value">{user?.subscribed ? ac.subscribed : ac.free}</span>
              </div>
            </div>

            {/* تعديل الاسم */}
            <div className="fields" style={{ marginTop: 6 }}>
              <label className="acct-field-label">{ac.nameL}</label>
              <input className="field" value={acctName}
                onChange={(e) => setAcctName(e.target.value)} placeholder={ac.nameL} />
            </div>

            {/* تغيير كلمة المرور */}
            <div className="acct-pass-head">{ac.changePass}</div>
            <div className="fields">
              <input className="field" type="password" placeholder={ac.curPass} value={acctCurPass}
                onChange={(e) => setAcctCurPass(e.target.value)} dir="ltr" autoComplete="current-password" />
              <input className="field" type="password" placeholder={ac.newPass} value={acctNewPass}
                onChange={(e) => setAcctNewPass(e.target.value)} dir="ltr" autoComplete="new-password" />
            </div>

            {acctErr && <div className="err">{acctErr}</div>}
            {acctOk && <div className="cost-hint" style={{ marginTop: 10 }}><IconSpark /> {acctOk}</div>}

            <button className="modal-submit" onClick={saveAcct} disabled={acctBusy}
              style={acctBusy ? { opacity: 0.75, cursor: "wait" } : null}>
              {acctBusy ? ac.saving : ac.save}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Feature({ icon, title, children }) {
  return (
    <div className="feat">
      <span className="feat-ic">{icon}</span>
      <h3>{title}</h3>
      <p>{children}</p>
    </div>
  );
}

const GAL = [
  "radial-gradient(120% 120% at 20% 0%, #FF6FB5 0%, #6D28D9 55%, #0B0B10 100%)",
  "radial-gradient(120% 120% at 80% 10%, #36D1FF 0%, #4338CA 55%, #0B0B10 100%)",
  "radial-gradient(120% 120% at 30% 90%, #34D399 0%, #0891B2 55%, #0B0B10 100%)",
  "radial-gradient(120% 120% at 70% 80%, #FBBF24 0%, #B45309 50%, #0B0B10 100%)",
  "radial-gradient(120% 120% at 50% 20%, #A855F7 0%, #312E81 55%, #0B0B10 100%)",
  "radial-gradient(120% 120% at 10% 50%, #FB7185 0%, #7C2D12 55%, #0B0B10 100%)",
];

const s = { width: 18, height: 18, fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round" };
const IconImage = () => (<svg viewBox="0 0 24 24" {...s}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>);
const IconVideo = () => (<svg viewBox="0 0 24 24" {...s}><rect x="2" y="5" width="14" height="14" rx="2"/><path d="M16 9l6-3v12l-6-3"/></svg>);
const IconSpark = () => (<svg viewBox="0 0 24 24" {...s}><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 15l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z"/></svg>);
const IconBolt = () => (<svg viewBox="0 0 24 24" {...s}><path d="M13 2L4 14h6l-1 8 9-12h-6z"/></svg>);
const IconLayers = () => (<svg viewBox="0 0 24 24" {...s}><path d="M12 3l9 5-9 5-9-5 9-5z"/><path d="M3 13l9 5 9-5"/></svg>);
const IconShield = () => (<svg viewBox="0 0 24 24" {...s}><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/></svg>);
const IconGlobe = () => (<svg viewBox="0 0 24 24" {...s}><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18"/></svg>);
const IconChevron = () => (<svg viewBox="0 0 24 24" {...s}><path d="M6 9l6 6 6-6"/></svg>);
const IconDownload = () => (<svg viewBox="0 0 24 24" {...s}><path d="M12 3v12"/><path d="M7 10l5 5 5-5"/><path d="M5 21h14"/></svg>);
const IconExpand = () => (<svg viewBox="0 0 24 24" {...s}><path d="M9 3H4v5"/><path d="M15 3h5v5"/><path d="M20 16v5h-5"/><path d="M4 16v5h5"/></svg>);

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&family=Noto+Sans:wght@400;600;800&family=Noto+Sans+Devanagari:wght@400;600;800&display=swap');

.tayf-root{
  --ink:#13141B; --ink2:#191B24; --surface:#1E202B; --surface2:#242734;
  --line:rgba(255,255,255,.10); --text:#F3F2F8; --muted:#AEB0C2; --spectrum:${SPECTRUM};
  position:relative; min-height:100vh; background:var(--ink); color:var(--text);
  font-family:'IBM Plex Sans Arabic','Noto Sans','Noto Sans Devanagari',system-ui,sans-serif; overflow-x:hidden;
  font-size:16.5px; font-weight:500;
}
.tayf-root *{box-sizing:border-box}
.tayf-root h1,.tayf-root h2,.tayf-root h3{font-family:'Tajawal','Noto Sans','Noto Sans Devanagari',sans-serif;margin:0}
.tayf-root a{color:inherit;text-decoration:none}

/* طبقة تموّج لوني هادئة خلف كل شيء */
.wavebg{position:fixed;inset:0;z-index:0;pointer-events:none;
  background:linear-gradient(125deg,#39424F,#474659,#3D515B,#474357,#39424F);
  background-size:300% 300%;animation:wave 28s ease-in-out infinite;opacity:.20}
@keyframes wave{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}

.aurora{position:fixed;inset:0;z-index:0;pointer-events:none;overflow:hidden;filter:blur(70px);opacity:.28}
.blob{position:absolute;border-radius:50%;mix-blend-mode:screen}
.b1{width:46vw;height:46vw;top:-12vw;right:-8vw;background:#5B6B96;animation:f1 11s ease-in-out infinite}
.b2{width:42vw;height:42vw;top:6vw;left:-10vw;background:#67648C;animation:f2 13s ease-in-out infinite}
.b3{width:38vw;height:38vw;top:34vw;right:14vw;background:#5C7E90;animation:f3 15s ease-in-out infinite}
.b4{width:34vw;height:34vw;top:24vw;left:18vw;background:#6C6790;animation:f1 17s ease-in-out infinite}
.blob.still{animation:none}
@keyframes f1{50%{transform:translate(-6vw,8vw) scale(1.18)}}
@keyframes f2{50%{transform:translate(7vw,-5vw) scale(1.14)}}
@keyframes f3{50%{transform:translate(-5vw,-7vw) scale(1.2)}}

.topbar{position:relative;z-index:3;display:flex;align-items:center;gap:18px;max-width:1080px;margin:0 auto;padding:22px 24px}
.brand{display:flex;align-items:center;gap:10px;margin-inline-end:auto}
.mark{width:28px;height:28px;border-radius:8px;background:var(--spectrum);box-shadow:0 0 16px rgba(139,92,246,.45)}
.brandname{font-weight:900;font-size:23px;letter-spacing:.3px}
.brandname.small{font-size:18px}
.nav{display:flex;gap:24px;font-size:15.5px;font-weight:600;color:var(--muted)}
.nav a:hover{color:var(--text)}
@media(max-width:720px){.nav{display:none}}

.lang-wrap{position:relative}
.lang-btn{display:inline-flex;align-items:center;gap:7px;background:transparent;border:1px solid var(--line);
  color:var(--text);padding:8px 13px;border-radius:999px;font-family:inherit;font-size:14px;cursor:pointer;transition:.2s}
.lang-btn:hover{border-color:rgba(255,255,255,.3)}
.lang-btn svg{width:16px;height:16px;opacity:.85}
.lang-menu{position:absolute;top:calc(100% + 8px);inset-inline-end:0;z-index:20;
  background:var(--surface2);border:1px solid var(--line);border-radius:14px;padding:6px;
  display:grid;grid-template-columns:1fr 1fr;gap:2px;min-width:230px;
  box-shadow:0 24px 60px -20px rgba(0,0,0,.8);backdrop-filter:blur(14px)}
.lang-item{background:transparent;border:none;color:var(--muted);font-family:inherit;font-size:14px;
  text-align:start;padding:9px 12px;border-radius:9px;cursor:pointer;transition:.15s}
.lang-item:hover{background:var(--ink2);color:var(--text)}
.lang-item.on{color:var(--text);background:rgba(139,92,246,.18)}

.ghost-btn{background:transparent;border:1px solid var(--line);color:var(--text);padding:9px 18px;
  border-radius:999px;font-family:inherit;font-size:14.5px;font-weight:600;cursor:pointer;transition:.2s}
.ghost-btn:hover{border-color:rgba(255,255,255,.3)}
@media(max-width:520px){.ghost-btn{display:none}}

main{position:relative;z-index:2;max-width:1080px;margin:0 auto;padding:0 24px 80px}

.hero{text-align:center;padding:48px 0 36px}
.eyebrow{display:inline-block;font-size:13.5px;font-weight:600;letter-spacing:1px;color:var(--muted);border:1px solid var(--line);padding:6px 14px;border-radius:999px;margin-bottom:22px}
.hero h1{font-size:clamp(34px,5.5vw,60px);font-weight:900;line-height:1.16}
.grad{background:var(--spectrum);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
.sub{color:var(--muted);font-size:clamp(16px,2vw,19px);max-width:600px;margin:20px auto 0;line-height:1.85;font-weight:500}

.studio{background:linear-gradient(180deg,rgba(28,28,40,.85),rgba(18,18,28,.85));border:1px solid var(--line);
  border-radius:24px;padding:22px;backdrop-filter:blur(14px);box-shadow:0 30px 80px -30px rgba(0,0,0,.8)}
.mode-row{display:flex;gap:8px;background:var(--ink2);border:1px solid var(--line);border-radius:14px;padding:5px;width:max-content;margin:0 auto 18px}
.mode{display:flex;align-items:center;gap:7px;background:transparent;border:none;color:var(--muted);font-family:inherit;font-size:15.5px;font-weight:600;padding:9px 22px;border-radius:10px;cursor:pointer;transition:.2s}
.mode.on{background:var(--surface2);color:var(--text);box-shadow:0 0 0 1px var(--line)}
.mode svg{width:17px;height:17px}

.prompt-box{background:var(--ink2);border:1px solid var(--line);border-radius:16px;padding:14px}
.prompt-box textarea{width:100%;background:transparent;border:none;resize:vertical;color:var(--text);font-family:inherit;font-size:16.5px;font-weight:500;line-height:1.7;outline:none;min-height:74px}
.prompt-box textarea::placeholder{color:#7E7C90}
.prompt-actions{display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin-top:10px;padding-top:12px;border-top:1px solid var(--line)}
.enhance{display:inline-flex;align-items:center;gap:8px;background:rgba(139,92,246,.14);border:1px solid rgba(139,92,246,.4);color:#D9CBFF;font-family:inherit;font-size:14.5px;font-weight:600;padding:9px 16px;border-radius:999px;cursor:pointer;transition:.2s}
.enhance:hover:not(:disabled){background:rgba(139,92,246,.24)}
.enhance:disabled{opacity:.5;cursor:default}
.enhance svg{width:16px;height:16px}
.hint{font-size:13.5px;color:var(--muted)}
.err{margin-top:12px;font-size:14px;color:#FCA5A5;background:rgba(248,113,113,.1);border:1px solid rgba(248,113,113,.3);padding:10px 12px;border-radius:10px}
.enhanced{margin-top:12px;background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:14px}
.enhanced-head{display:flex;align-items:center;justify-content:space-between;font-size:13px;color:#C4B5FD;margin-bottom:8px}
.enhanced-head span{display:inline-flex;align-items:center;gap:6px}
.enhanced-head svg{width:15px;height:15px}
.copy{background:transparent;border:1px solid var(--line);color:var(--text);font-family:inherit;font-size:12px;padding:4px 12px;border-radius:8px;cursor:pointer}
.copy:hover{border-color:rgba(255,255,255,.3)}
.enhanced p{margin:0;font-size:14px;line-height:1.7;color:#CFCDDC;font-family:'Noto Sans',system-ui,sans-serif;text-align:left}

.control-group{margin-top:20px}
.ctl-label{display:block;font-size:14px;font-weight:600;color:var(--text);margin-bottom:10px}
.chips{display:flex;flex-wrap:wrap;gap:8px}
.chip{background:var(--ink2);border:1px solid var(--line);color:var(--text);font-family:inherit;font-size:15px;font-weight:600;padding:9px 17px;border-radius:999px;cursor:pointer;transition:.18s}
.chip:hover{color:var(--text);border-color:rgba(255,255,255,.25)}
.chip.on{background:var(--surface2);color:var(--text);border-color:rgba(139,92,246,.55);box-shadow:0 0 0 1px rgba(139,92,246,.3)}
.control-grid{display:grid;grid-template-columns:1fr 1fr;gap:24px}
@media(max-width:620px){.control-grid{grid-template-columns:1fr}}

.models{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
@media(max-width:620px){.models{grid-template-columns:1fr}}
.model{display:flex;flex-direction:column;gap:5px;text-align:start;background:var(--ink2);border:1px solid var(--line);border-radius:14px;padding:14px;cursor:pointer;font-family:inherit;color:var(--text);transition:.18s}
.model:hover{border-color:rgba(255,255,255,.22)}
.model.on{border-color:rgba(139,92,246,.6);box-shadow:0 0 0 1px rgba(139,92,246,.35);background:linear-gradient(180deg,rgba(139,92,246,.12),var(--ink2))}
.model-top{display:flex;align-items:center;justify-content:space-between;gap:8px}
.model-name{font-weight:700;font-size:16px}
.model-badge{font-size:11px;color:#0B0B10;background:var(--spectrum);padding:3px 9px;border-radius:999px;font-weight:600;white-space:nowrap}
.model-by{font-size:12px;color:var(--muted)}
.model.locked{opacity:.55;cursor:not-allowed}
.model.locked:hover{border-color:var(--line)}
.model-lock{font-size:11px;color:var(--muted);background:var(--ink2);border:1px solid var(--line);
  padding:3px 9px;border-radius:999px;white-space:nowrap}
.model-note{font-size:12.5px;color:#B6B3C6;line-height:1.6;margin-top:2px}

.range{width:100%;accent-color:#8B5CF6;margin-top:8px}
.range-ticks{display:flex;justify-content:space-between;margin-top:6px;font-size:12px;color:var(--muted)}

.generate{margin-top:26px;width:100%;display:flex;align-items:center;justify-content:center;gap:10px;background:var(--spectrum);border:none;color:#0B0B10;font-family:'Tajawal','Noto Sans',sans-serif;font-weight:800;font-size:18px;padding:16px;border-radius:14px;cursor:pointer;transition:.2s;box-shadow:0 14px 40px -10px rgba(139,92,246,.6)}
.generate:hover{transform:translateY(-1px);box-shadow:0 18px 50px -10px rgba(139,92,246,.75)}
.generate svg{width:19px;height:19px}

.results{margin-top:24px}
.empty{text-align:center;color:var(--muted);font-size:14.5px;border:1px dashed var(--line);border-radius:14px;padding:34px 16px}
.results-meta{display:flex;gap:8px;color:var(--muted);font-size:13px;margin-bottom:14px;align-items:center;flex-wrap:wrap}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px}
.card{position:relative;border-radius:14px;background:var(--ink2);border:1px solid var(--line);display:flex;align-items:center;justify-content:center;color:#5B5970;overflow:hidden}
.card svg{width:30px;height:30px;position:relative;z-index:1}
.card-glow{position:absolute;inset:0;background:var(--spectrum);opacity:.1}
.card-num{position:absolute;top:8px;inset-inline-start:10px;font-size:12px;color:var(--muted)}
.card-actions{position:absolute;top:8px;inset-inline-end:8px;display:flex;gap:6px;z-index:2;opacity:0;transition:.18s}
.card:hover .card-actions{opacity:1}
.card-act{display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:10px;
  background:rgba(10,10,16,.62);border:1px solid rgba(255,255,255,.18);color:#fff;cursor:pointer;backdrop-filter:blur(6px);transition:.15s}
.card-act:hover{background:rgba(10,10,16,.85);border-color:rgba(255,255,255,.4)}
.card-act svg{width:18px;height:18px}
@media(hover:none){.card-actions{opacity:1}}

.lb-overlay{position:fixed;inset:0;z-index:60;background:rgba(5,5,9,.9);backdrop-filter:blur(10px);
  display:flex;align-items:center;justify-content:center;padding:24px;animation:fade .2s ease}
.lb-close{position:absolute;top:18px;inset-inline-end:22px;background:transparent;border:none;color:#fff;
  font-size:34px;line-height:1;cursor:pointer;opacity:.85}
.lb-close:hover{opacity:1}
.lb-stage{display:flex;flex-direction:column;align-items:center;gap:16px;max-width:92vw;max-height:88vh}
.lb-media{max-width:92vw;max-height:74vh;border-radius:14px;box-shadow:0 30px 90px -20px rgba(0,0,0,.9);object-fit:contain}
.lb-download{display:inline-flex;align-items:center;gap:9px;background:var(--spectrum);border:none;color:#0B0B10;
  font-family:'Tajawal','Noto Sans',sans-serif;font-weight:800;font-size:16px;padding:13px 28px;border-radius:999px;
  cursor:pointer;transition:.2s;box-shadow:0 12px 34px -12px rgba(110,126,168,.6)}
.lb-download:hover{transform:translateY(-1px)}
.lb-download svg{width:18px;height:18px}
.note{margin-top:16px;font-size:13px;color:var(--muted);line-height:1.8;background:var(--ink2);border:1px solid var(--line);border-radius:12px;padding:14px}

.gallery{margin-top:72px}
.gallery h2,.features h2{font-size:clamp(26px,4vw,36px);font-weight:900;text-align:center;margin-bottom:30px}
.gal-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
@media(max-width:620px){.gal-grid{grid-template-columns:repeat(2,1fr)}}
.gal{position:relative;aspect-ratio:3/4;border-radius:16px;border:1px solid var(--line);overflow:hidden}
.gal-tag{position:absolute;bottom:10px;inset-inline-start:12px;font-size:12px;background:rgba(0,0,0,.4);padding:4px 10px;border-radius:8px;backdrop-filter:blur(4px)}

.features{margin-top:80px}
.feat-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
@media(max-width:860px){.feat-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:480px){.feat-grid{grid-template-columns:1fr}}
.feat{background:var(--surface);border:1px solid var(--line);border-radius:18px;padding:22px}
.feat-ic{display:inline-flex;width:42px;height:42px;align-items:center;justify-content:center;border-radius:12px;background:rgba(139,92,246,.15);color:#C4B5FD;margin-bottom:14px}
.feat-ic svg{width:21px;height:21px}
.feat h3{font-size:19px;font-weight:800;margin-bottom:8px}
.feat p{font-size:14.5px;color:var(--muted);line-height:1.8;margin:0}

.footer{margin-top:80px;text-align:center;border-top:1px solid var(--line);padding-top:30px}
.footer p{color:var(--muted);font-size:13px;margin-top:8px}

.ghost-btn.small{padding:7px 14px;font-size:13px}
.acct{display:flex;align-items:center;gap:12px}
.acct-credits{display:inline-flex;align-items:center;gap:6px;font-size:13px;color:#D9CBFF;
  background:rgba(139,92,246,.14);border:1px solid rgba(139,92,246,.4);padding:6px 12px;border-radius:999px;white-space:nowrap}
.acct-credits svg{width:14px;height:14px}
.acct-name{font-size:14.5px;color:var(--text);font-weight:700;background:transparent;border:none;font-family:inherit;cursor:pointer;padding:4px 6px;border-radius:8px;transition:.15s}
.acct-name:hover{background:var(--ink2)}
.acct-info{background:var(--ink2);border:1px solid var(--line);border-radius:14px;padding:6px 14px;margin-bottom:18px}
.acct-row{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:11px 0;border-bottom:1px solid var(--line)}
.acct-row:last-child{border-bottom:none}
.acct-row-label{font-size:13.5px;color:var(--muted)}
.acct-row-value{font-size:14.5px;color:var(--text);font-weight:600}
.acct-field-label{display:block;font-size:13px;color:var(--muted);margin-bottom:7px}
.acct-pass-head{font-size:14px;font-weight:700;color:var(--text);margin:18px 0 10px;padding-top:16px;border-top:1px solid var(--line)}
.acct-sub{display:inline-flex;align-items:center;justify-content:center;width:20px;height:20px;
  border-radius:50%;background:var(--spectrum);color:#0B0B10;font-size:12px;font-weight:800}
@media(max-width:620px){.acct-name{display:none}}

.trial-cta{margin-top:26px;display:inline-flex;align-items:center;gap:9px;background:var(--spectrum);
  border:none;color:#0B0B10;font-family:'Tajawal','Noto Sans',sans-serif;font-weight:800;font-size:16.5px;
  padding:14px 28px;border-radius:999px;cursor:pointer;transition:.2s;box-shadow:0 14px 40px -10px rgba(139,92,246,.6)}
.trial-cta:hover{transform:translateY(-1px);box-shadow:0 18px 50px -10px rgba(139,92,246,.75)}
.trial-cta svg{width:17px;height:17px}

.cost-hint{margin-top:12px;display:flex;align-items:center;justify-content:center;gap:7px;font-size:13.5px;color:var(--muted)}
.cost-hint svg{width:14px;height:14px;color:#C4B5FD}
.nocredit{margin-top:16px;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;
  background:rgba(251,191,36,.1);border:1px solid rgba(251,191,36,.35);border-radius:12px;padding:14px 16px;
  font-size:14px;color:#FCD34D}
.upgrade{background:var(--spectrum);border:none;color:#0B0B10;font-family:inherit;font-weight:700;
  font-size:14px;padding:9px 20px;border-radius:999px;cursor:pointer;white-space:nowrap}

.modal-overlay{position:fixed;inset:0;z-index:50;background:rgba(6,6,10,.72);backdrop-filter:blur(8px);
  display:flex;align-items:center;justify-content:center;padding:20px;animation:fade .2s ease}
@keyframes fade{from{opacity:0}to{opacity:1}}
.modal{position:relative;width:100%;max-width:400px;background:var(--surface2);border:1px solid var(--line);
  border-radius:22px;padding:30px 26px 22px;box-shadow:0 40px 100px -30px rgba(0,0,0,.9)}
.modal-close{position:absolute;top:14px;inset-inline-end:16px;background:transparent;border:none;
  color:var(--muted);font-size:26px;line-height:1;cursor:pointer}
.modal-close:hover{color:var(--text)}
.modal-trial{display:inline-flex;align-items:center;gap:6px;font-size:12px;color:#0B0B10;
  background:var(--spectrum);padding:4px 12px;border-radius:999px;font-weight:700;margin-bottom:14px}
.modal-trial svg{width:13px;height:13px}
.modal-title{font-size:25px;font-weight:900;margin-bottom:6px}
.modal-sub{color:var(--muted);font-size:14.5px;margin:0 0 20px}
.fields{display:flex;flex-direction:column;gap:10px}
.field{background:var(--ink2);border:1px solid var(--line);border-radius:12px;padding:13px 15px;
  color:var(--text);font-family:inherit;font-size:15px;outline:none;transition:.18s;width:100%}
.field::placeholder{color:#7E7C90}
.field:focus{border-color:rgba(139,92,246,.6);box-shadow:0 0 0 1px rgba(139,92,246,.3)}
.modal-submit{margin-top:16px;width:100%;background:var(--spectrum);border:none;color:#0B0B10;
  font-family:'Tajawal','Noto Sans',sans-serif;font-weight:800;font-size:16.5px;padding:14px;border-radius:12px;
  cursor:pointer;transition:.2s;box-shadow:0 12px 34px -12px rgba(139,92,246,.6)}
.modal-submit:hover{transform:translateY(-1px)}
.modal-toggle{margin-top:14px;width:100%;background:transparent;border:none;color:var(--muted);
  font-family:inherit;font-size:14px;cursor:pointer}
.modal-toggle:hover{color:var(--text)}
.modal-demo{margin:16px 0 0;font-size:11.5px;color:#7E7C90;line-height:1.6;text-align:center;
  border-top:1px solid var(--line);padding-top:14px}

.plans-modal{max-width:760px}
.plans{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:8px}
@media(max-width:640px){.plans{grid-template-columns:1fr}}
.plan{position:relative;display:flex;flex-direction:column;gap:8px;background:var(--ink2);
  border:1px solid var(--line);border-radius:16px;padding:20px 18px}
.plan.popular{border-color:rgba(139,92,246,.6);box-shadow:0 0 0 1px rgba(139,92,246,.35)}
.plan-pop{position:absolute;top:-10px;inset-inline-start:18px;font-size:11px;color:#0B0B10;
  background:var(--spectrum);padding:3px 10px;border-radius:999px;font-weight:700}
.plan-name{font-family:'Tajawal','Noto Sans',sans-serif;font-weight:700;font-size:18px}
.plan-price{font-family:'Tajawal','Noto Sans',sans-serif;font-weight:800;font-size:32px}
.plan-price small{font-size:14px;color:var(--muted);font-weight:500}
.plan-credits{font-size:14px;color:#C4B5FD}
.plan-feature{font-size:13px;color:var(--muted)}
.plan-btn{margin-top:8px;background:var(--spectrum);border:none;color:#0B0B10;
  font-family:'Tajawal','Noto Sans',sans-serif;font-weight:800;font-size:15px;padding:12px;
  border-radius:11px;cursor:pointer;transition:.2s}
.plan-btn:hover{transform:translateY(-1px)}

:focus-visible{outline:2px solid #8B5CF6;outline-offset:2px;border-radius:6px}
@media(prefers-reduced-motion:reduce){.blob{animation:none!important}.generate:hover{transform:none}}
`;
