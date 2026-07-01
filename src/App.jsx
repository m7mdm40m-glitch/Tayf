import React, { useState, useEffect, useRef, useCallback } from "react";

// ====== طيف — استوديو الذكاء الاصطناعي لتوليد الصور والفيديو ======
// واجهة متعددة اللغات (11 لغة) مع تبديل تلقائي RTL/LTR.

const SPECTRUM = "linear-gradient(115deg, #9D4EFF 0%, #FF2E97 50%, #22B4EE 100%)";

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
    eyebrow:"استوديو الذكاء الاصطناعي · جيل جديد", h1a:"من", h1g:"الكلمة", h1b:"إلى صورة أو فيديو",
    subA:"اكتب فكرتك", subG:"بأي لغة", subB:"— والذكاء الاصطناعي يفهمها ويحوّلها إلى محتوى احترافي جاهز للريلز والمنشورات.",
    image:"صورة", video:"فيديو",
    phImg:"مثال: قطة فضائية تجلس على سطح المريخ وتنظر إلى الأرض البعيدة، إضاءة سينمائية...",
    phVid:"مثال: فتاة تمشي وسط شارع مطر ليلاً مع أضواء نيون منعكسة على الأرض، كاميرا تتحرك ببطء...",
    enhance:"حسّن الوصف بالذكاء الاصطناعي", enhancing:"جارٍ التحسين…", hint:"يحوّل فكرتك إلى وصف إنجليزي مفصّل لنتائج أقوى",
    errRetry:"تعذّر التحسين. حاول مرة أخرى.", errGen:"تعذّر التوليد. حاول مرة أخرى.", errConn:"تعذّر الاتصال بخدمة الذكاء الاصطناعي. حاول مرة أخرى.",
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
    eyebrow:"AI Studio · New generation", h1a:"From a", h1g:"word", h1b:"to an image or video",
    subA:"Write your idea", subG:"in any language", subB:"— AI understands it and turns it into professional content ready for Reels and posts.",
    image:"Image", video:"Video",
    phImg:"e.g. A space cat sitting on the surface of Mars gazing at distant Earth, cinematic lighting...",
    phVid:"e.g. A girl walks down a rainy street at night with neon lights reflecting on the ground, slow camera move...",
    enhance:"Enhance prompt with AI", enhancing:"Enhancing…", hint:"Turns your idea into a detailed English prompt for stronger results",
    errRetry:"Couldn't enhance. Try again.", errGen:"Couldn't generate. Try again.", errConn:"Couldn't reach the AI service. Try again.",
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
    eyebrow:"ستۆدیۆی زیرەکی دەستکرد · نەوەی نوێ", h1a:"لە", h1g:"وشە", h1b:"بۆ وێنە یان ڤیدیۆ",
    subA:"بیرۆکەکەت بنووسە", subG:"بە هەر زمانێک", subB:"— زیرەکی دەستکرد لێی تێدەگات و دەیکات بە ناوەڕۆکێکی پیشەیی ئامادە بۆ ڕیلز و پۆست.",
    image:"وێنە", video:"ڤیدیۆ",
    phImg:"نموونە: پشیلەیەکی ئاسمانی لەسەر ڕووی مەریخ دانیشتووە و سەیری زەوی دوور دەکات، ڕووناکی سینەمایی...",
    phVid:"نموونە: کچێک بە شەقامێکی بارانیدا بە شەو دەڕوات و ڕووناکی نیۆن لەسەر زەوی دەدرەوشێتەوە، کامێرا هێواش دەجووڵێت...",
    enhance:"باشترکردنی وەسف بە AI", enhancing:"باشتر دەکرێت…", hint:"بیرۆکەکەت دەکات بە وەسفێکی وردی ئینگلیزی بۆ ئەنجامی بەهێزتر",
    errRetry:"باشترکردن سەرکەوتوو نەبوو. دووبارە هەوڵبدە.", errGen:"دروستکردن سەرکەوتوو نەبوو. دووبارە هەوڵبدە.", errConn:"پەیوەندی بە خزمەتگوزاری AI نەکرا. دووبارە هەوڵبدە.",
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
    eyebrow:"استودیوی هوش مصنوعی · نسل جدید", h1a:"از یک", h1g:"کلمه", h1b:"تا تصویر یا ویدیو",
    subA:"ایده‌ات را بنویس", subG:"به هر زبانی", subB:"— هوش مصنوعی آن را می‌فهمد و به محتوای حرفه‌ای آمادهٔ ریلز و پست تبدیل می‌کند.",
    image:"تصویر", video:"ویدیو",
    phImg:"مثال: گربه‌ای فضایی روی سطح مریخ نشسته و به زمین دور نگاه می‌کند، نورپردازی سینمایی...",
    phVid:"مثال: دختری شب در خیابانی بارانی راه می‌رود و نورهای نئون روی زمین منعکس شده، حرکت آرام دوربین...",
    enhance:"بهبود توضیح با هوش مصنوعی", enhancing:"در حال بهبود…", hint:"ایده‌ات را به توضیح انگلیسی دقیق برای نتایج قوی‌تر تبدیل می‌کند",
    errRetry:"بهبود ممکن نشد. دوباره تلاش کن.", errGen:"تولید ممکن نشد. دوباره تلاش کن.", errConn:"اتصال به سرویس هوش مصنوعی ممکن نشد. دوباره تلاش کن.",
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
    eyebrow:"اے آئی اسٹوڈیو · نئی نسل", h1a:"ایک", h1g:"لفظ", h1b:"سے تصویر یا ویڈیو تک",
    subA:"اپنا خیال لکھیں", subG:"کسی بھی زبان میں", subB:"— اے آئی اسے سمجھتا ہے اور ریلز و پوسٹ کے لیے پیشہ ورانہ مواد بنا دیتا ہے۔",
    image:"تصویر", video:"ویڈیو",
    phImg:"مثال: ایک خلائی بلی مریخ کی سطح پر بیٹھی دور زمین کو دیکھ رہی ہے، سینمائی روشنی...",
    phVid:"مثال: ایک لڑکی رات کو بارش والی سڑک پر چل رہی ہے، نیون روشنیاں زمین پر منعکس، کیمرہ آہستہ حرکت...",
    enhance:"اے آئی سے تفصیل بہتر بنائیں", enhancing:"بہتر کیا جا رہا ہے…", hint:"آپ کے خیال کو مضبوط نتائج کے لیے تفصیلی انگریزی پرامپٹ میں بدلتا ہے",
    errRetry:"بہتر نہیں ہو سکا۔ دوبارہ کوشش کریں۔", errGen:"تخلیق نہیں ہو سکی۔ دوبارہ کوشش کریں۔", errConn:"اے آئی سروس سے رابطہ نہ ہو سکا۔ دوبارہ کوشش کریں۔",
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
    eyebrow:"Yapay Zeka Stüdyosu · Yeni nesil", h1a:"Bir", h1g:"kelimeden", h1b:"görsele veya videoya",
    subA:"Fikrini yaz", subG:"herhangi bir dilde", subB:"— yapay zeka anlar ve Reels ile gönderiler için profesyonel içeriğe dönüştürür.",
    image:"Görsel", video:"Video",
    phImg:"örn. Mars yüzeyinde oturup uzaktaki Dünya'ya bakan uzaylı bir kedi, sinematik ışık...",
    phVid:"örn. Yağmurlu bir sokakta geceleyin yürüyen bir kız, yerde yansıyan neon ışıklar, yavaş kamera hareketi...",
    enhance:"İstemi yapay zeka ile geliştir", enhancing:"Geliştiriliyor…", hint:"Fikrini daha güçlü sonuçlar için ayrıntılı İngilizce isteme dönüştürür",
    errRetry:"Geliştirilemedi. Tekrar dene.", errGen:"Oluşturulamadı. Tekrar dene.", errConn:"Yapay zeka servisine ulaşılamadı. Tekrar dene.",
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
    eyebrow:"Studio IA · Nouvelle génération", h1a:"D'un", h1g:"mot", h1b:"à une image ou vidéo",
    subA:"Écris ton idée", subG:"dans n'importe quelle langue", subB:"— l'IA la comprend et la transforme en contenu pro prêt pour les Reels et les posts.",
    image:"Image", video:"Vidéo",
    phImg:"ex. Un chat spatial assis à la surface de Mars regardant la Terre lointaine, éclairage cinématographique...",
    phVid:"ex. Une fille marche dans une rue pluvieuse la nuit, néons reflétés au sol, mouvement de caméra lent...",
    enhance:"Améliorer le prompt avec l'IA", enhancing:"Amélioration…", hint:"Transforme ton idée en prompt anglais détaillé pour de meilleurs résultats",
    errRetry:"Échec de l'amélioration. Réessaie.", errGen:"Échec de la génération. Réessaie.", errConn:"Impossible de joindre le service IA. Réessaie.",
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
    eyebrow:"Estudio de IA · Nueva generación", h1a:"De una", h1g:"palabra", h1b:"a una imagen o video",
    subA:"Escribe tu idea", subG:"en cualquier idioma", subB:"— la IA la entiende y la convierte en contenido profesional listo para Reels y publicaciones.",
    image:"Imagen", video:"Video",
    phImg:"p. ej. Un gato espacial sentado en la superficie de Marte mirando la Tierra lejana, iluminación cinematográfica...",
    phVid:"p. ej. Una chica camina por una calle lluviosa de noche, luces de neón reflejadas en el suelo, cámara lenta...",
    enhance:"Mejorar prompt con IA", enhancing:"Mejorando…", hint:"Convierte tu idea en un prompt detallado en inglés para mejores resultados",
    errRetry:"No se pudo mejorar. Inténtalo de nuevo.", errGen:"No se pudo generar. Inténtalo de nuevo.", errConn:"No se pudo conectar con el servicio de IA. Inténtalo de nuevo.",
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
    eyebrow:"KI-Studio · Neue Generation", h1a:"Von einem", h1g:"Wort", h1b:"zum Bild oder Video",
    subA:"Schreib deine Idee", subG:"in jeder Sprache", subB:"— die KI versteht sie und macht daraus professionellen Content für Reels und Posts.",
    image:"Bild", video:"Video",
    phImg:"z. B. Eine Weltraumkatze sitzt auf der Marsoberfläche und blickt zur fernen Erde, filmisches Licht...",
    phVid:"z. B. Ein Mädchen geht nachts eine regnerische Straße entlang, Neonlichter spiegeln sich am Boden, langsame Kamera...",
    enhance:"Prompt mit KI verbessern", enhancing:"Wird verbessert…", hint:"Macht aus deiner Idee einen detaillierten englischen Prompt für bessere Ergebnisse",
    errRetry:"Verbesserung fehlgeschlagen. Versuch es nochmal.", errGen:"Erstellung fehlgeschlagen. Versuch es nochmal.", errConn:"KI-Dienst nicht erreichbar. Versuch es nochmal.",
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
    eyebrow:"ИИ-студия · Новое поколение", h1a:"От", h1g:"слова", h1b:"до изображения или видео",
    subA:"Напишите свою идею", subG:"на любом языке", subB:"— ИИ поймёт её и превратит в профессиональный контент для Reels и постов.",
    image:"Изображение", video:"Видео",
    phImg:"напр. Космический кот сидит на поверхности Марса и смотрит на далёкую Землю, кинематографический свет...",
    phVid:"напр. Девушка идёт по дождливой улице ночью, неоновые огни отражаются на земле, медленное движение камеры...",
    enhance:"Улучшить промпт с ИИ", enhancing:"Улучшаем…", hint:"Превращает вашу идею в подробный английский промпт для лучших результатов",
    errRetry:"Не удалось улучшить. Попробуйте снова.", errGen:"Не удалось сгенерировать. Попробуйте снова.", errConn:"Не удалось связаться с сервисом ИИ. Попробуйте снова.",
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
    eyebrow:"एआई स्टूडियो · नई पीढ़ी", h1a:"एक", h1g:"शब्द", h1b:"से तस्वीर या वीडियो तक",
    subA:"अपना विचार लिखें", subG:"किसी भी भाषा में", subB:"— एआई इसे समझता है और इसे Reels व पोस्ट के लिए पेशेवर कंटेंट में बदल देता है।",
    image:"तस्वीर", video:"वीडियो",
    phImg:"उदा. मंगल की सतह पर बैठी एक अंतरिक्ष बिल्ली दूर पृथ्वी को देखते हुए, सिनेमाई रोशनी...",
    phVid:"उदा. रात में बारिश वाली सड़क पर चलती एक लड़की, ज़मीन पर परावर्तित नियॉन रोशनी, धीमा कैमरा मूव...",
    enhance:"एआई से प्रॉम्प्ट बेहतर करें", enhancing:"बेहतर किया जा रहा है…", hint:"आपके विचार को मज़बूत नतीजों के लिए विस्तृत अंग्रेज़ी प्रॉम्प्ट में बदलता है",
    errRetry:"बेहतर नहीं हो सका। दोबारा कोशिश करें।", errGen:"जेनरेट नहीं हो सका। दोबारा कोशिश करें।", errConn:"एआई सेवा से संपर्क नहीं हो सका। दोबारा कोशिश करें।",
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
  ar:{su:"إنشاء حساب",li:"تسجيل الدخول",suSub:"أنشئ حسابك واحصل على تجربة مجانية",liSub:"مرحباً بعودتك",name:"الاسم",email:"البريد الإلكتروني",pass:"كلمة المرور",doSu:"إنشاء الحساب وبدء التجربة",doLi:"تسجيل الدخول",have:"لديك حساب؟ سجّل الدخول",no:"ليس لديك حساب؟ أنشئ واحداً",trial:"تجربة مجانية",credits:"رصيد",left:"رصيد مجاني متبقٍ",logout:"خروج",errFields:"يرجى ملء جميع الحقول",errEmail:"هذا البريد مسجّل بالفعل",errLogin:"البريد أو كلمة المرور غير صحيحة",noCredits:"انتهت تجربتك المجانية — اشترك للمتابعة",upgrade:"اشترِك",freeCta:"ابدأ التجربة المجانية",gate:"أنشئ حساباً لبدء تجربتك المجانية",demo:"نموذج تجريبي — في الإنتاج يجب أن تكون الحسابات وكلمات المرور على خادم آمن.",cost:"التكلفة",pricing:"اختر خطتك",mo:"/شهر",crM:"عملة شهرياً",pop:"الأكثر طلباً",allM:"كل النماذج مفتوحة",subOk:"أنت مشترك الآن ✓",p1:"بداية",p2:"احترافي",p3:"أعمال",close:"إغلاق",errTooMany:"محاولات كثيرة جداً. انتظر ١٥ دقيقة ثم حاول من جديد.",fpLink:"نسيت كلمة السر؟",fpTitle:"استعادة كلمة المرور",fpSub:"أدخل بريدك ونرسل لك رمزاً مكوّناً من ٦ أرقام.",fpSend:"إرسال الرمز",rsTitle:"تعيين كلمة مرور جديدة",rsSub:"أدخل الرمز المُرسل إلى بريدك وكلمة المرور الجديدة.",codePh:"رمز مكوّن من ٦ أرقام",newPassPh:"كلمة المرور الجديدة",rsDo:"تعيين كلمة المرور",backLogin:"رجوع لتسجيل الدخول",rsSent:"إذا كان البريد مسجّلاً، وصلك رمز مكوّن من ٦ أرقام. تحقّق من بريدك (وصندوق الرسائل غير المرغوبة).",rsDone:"تم تغيير كلمة المرور بنجاح ✓ سجّل الدخول بكلمتك الجديدة.",errCode:"الرمز غير صحيح أو منتهٍ. تأكّد منه أو اطلب رمزاً جديداً.",errShort6:"كلمة المرور يجب أن تكون ٦ أحرف على الأقل.",blocked:"هذا الوصف مخالف لسياسة المحتوى. جرّب وصفاً آخر.",manyReq:"طلبات كثيرة. انتظر قليلاً ثم حاول.",sessEnd:"انتهت الجلسة، سجّل الدخول من جديد."},
  en:{su:"Sign up",li:"Sign in",suSub:"Create your account and get a free trial",liSub:"Welcome back",name:"Name",email:"Email",pass:"Password",doSu:"Create account & start trial",doLi:"Sign in",have:"Have an account? Sign in",no:"No account? Create one",trial:"Free trial",credits:"Balance",left:"free credits left",logout:"Log out",errFields:"Please fill in all fields",errEmail:"This email is already registered",errLogin:"Email or password is incorrect",noCredits:"Your free trial is over — subscribe to continue",upgrade:"Upgrade",freeCta:"Start free trial",gate:"Create an account to start your free trial",demo:"Demo only — in production, accounts and passwords must live on a secure backend.",cost:"Cost",pricing:"Choose your plan",mo:"/mo",crM:"credits / month",pop:"Most popular",allM:"All models unlocked",subOk:"You're subscribed ✓",p1:"Starter",p2:"Pro",p3:"Business",close:"Close",errTooMany:"Too many attempts. Wait 15 minutes and try again.",fpLink:"Forgot password?",fpTitle:"Reset password",fpSub:"Enter your email and we'll send you a 6-digit code.",fpSend:"Send code",rsTitle:"Set a new password",rsSub:"Enter the code sent to your email and your new password.",codePh:"6-digit code",newPassPh:"New password",rsDo:"Set password",backLogin:"Back to sign in",rsSent:"If the email is registered, a 6-digit code has been sent. Check your inbox (and spam).",rsDone:"Password changed successfully ✓ Sign in with your new password.",errCode:"The code is wrong or expired. Check it or request a new one.",errShort6:"Password must be at least 6 characters.",blocked:"This prompt violates the content policy. Try a different one.",manyReq:"Too many requests. Wait a moment and try again.",sessEnd:"Session expired, sign in again."},
  ku:{su:"دروستکردنی هەژمار",li:"چوونەژوورەوە",suSub:"هەژمارەکەت دروست بکە و تاقیکردنەوەی بەخۆڕایی بەدەست بهێنە",liSub:"بەخێربێیتەوە",name:"ناو",email:"ئیمەیڵ",pass:"تێپەڕەوشە",doSu:"دروستکردن و دەستپێکردنی تاقیکردنەوە",doLi:"چوونەژوورەوە",have:"هەژمارت هەیە؟ بچۆ ژوورەوە",no:"هەژمارت نییە؟ یەکێک دروست بکە",trial:"تاقیکردنەوەی بەخۆڕایی",credits:"باڵانس",left:"باڵانسی بەخۆڕایی ماوە",logout:"دەرچوون",errFields:"تکایە هەموو خانەکان پڕبکەرەوە",errEmail:"ئەم ئیمەیڵە پێشتر تۆمارکراوە",errLogin:"ئیمەیڵ یان تێپەڕەوشە هەڵەیە",noCredits:"تاقیکردنەوەی بەخۆڕاییت تەواوبوو — بەشداربە بۆ بەردەوامبوون",upgrade:"بەشداربە",freeCta:"دەستپێکردنی تاقیکردنەوەی بەخۆڕایی",gate:"هەژمارێک دروست بکە بۆ دەستپێکردنی تاقیکردنەوەکەت",demo:"تەنها نموونە — لە بەرهەمهێناندا دەبێت هەژمار و تێپەڕەوشە لەسەر سێرڤەری پارێزراو بن.",cost:"تێچوو",pricing:"پلانەکەت هەڵبژێرە",mo:"/مانگ",crM:"باڵانس مانگانە",pop:"زۆرترین داواکراو",allM:"هەموو مۆدێلەکان کراوەن",subOk:"ئێستا بەشداریت کردووە ✓",p1:"دەستپێک",p2:"پڕۆ",p3:"بزنس",close:"داخستن",errTooMany:"هەوڵی زۆر. ١٥ خولەک چاوەڕێ بکە و دووبارە هەوڵبدە.",fpLink:"تێپەڕەوشەت لەبیرکردووە؟",fpTitle:"گەڕاندنەوەی تێپەڕەوشە",fpSub:"ئیمەیڵەکەت بنووسە و کۆدێکی ٦ ژمارەییت بۆ دەنێرین.",fpSend:"ناردنی کۆد",rsTitle:"دانانی تێپەڕەوشەی نوێ",rsSub:"کۆدی نێردراو بۆ ئیمەیڵەکەت و تێپەڕەوشە نوێیەکەت بنووسە.",codePh:"کۆدی ٦ ژمارەیی",newPassPh:"تێپەڕەوشەی نوێ",rsDo:"دانانی تێپەڕەوشە",backLogin:"گەڕانەوە بۆ چوونەژوورەوە",rsSent:"ئەگەر ئیمەیڵەکە تۆمارکرابێت، کۆدێکی ٦ ژمارەیی نێردرا. ئیمەیڵەکەت بپشکنە (و spam).",rsDone:"تێپەڕەوشە بەسەرکەوتوویی گۆڕدرا ✓ بە تێپەڕەوشە نوێیەکەت بچۆ ژوورەوە.",errCode:"کۆدەکە هەڵەیە یان بەسەرچووە. دڵنیابە یان کۆدێکی نوێ داوا بکە.",errShort6:"تێپەڕەوشە دەبێت لانیکەم ٦ پیت بێت.",blocked:"ئەم وەسفە پێچەوانەی سیاسەتی ناوەڕۆکە. وەسفێکی تر تاقیبکەرەوە.",manyReq:"داواکاری زۆر. تۆزێک چاوەڕێ بکە.",sessEnd:"دانیشتن کۆتایی هات، دووبارە بچۆ ژوورەوە."},
  fa:{su:"ثبت‌نام",li:"ورود",suSub:"حساب بساز و نسخهٔ آزمایشی رایگان بگیر",liSub:"خوش آمدی",name:"نام",email:"ایمیل",pass:"رمز عبور",doSu:"ساخت حساب و شروع آزمایش",doLi:"ورود",have:"حساب داری؟ وارد شو",no:"حساب نداری؟ بساز",trial:"آزمایش رایگان",credits:"موجودی",left:"اعتبار رایگان باقی‌مانده",logout:"خروج",errFields:"لطفاً همهٔ فیلدها را پر کن",errEmail:"این ایمیل قبلاً ثبت شده",errLogin:"ایمیل یا رمز عبور نادرست است",noCredits:"آزمایش رایگانت تمام شد — برای ادامه اشتراک بگیر",upgrade:"ارتقا",freeCta:"شروع آزمایش رایگان",gate:"برای شروع آزمایش رایگان حساب بساز",demo:"فقط نمونه — در محصول واقعی حساب و رمز باید روی سرور امن باشند.",cost:"هزینه",pricing:"طرح خود را انتخاب کن",mo:"/ماه",crM:"اعتبار در ماه",pop:"محبوب‌ترین",allM:"همهٔ مدل‌ها باز",subOk:"اکنون مشترک شدی ✓",p1:"شروع",p2:"حرفه‌ای",p3:"تجاری",close:"بستن",errTooMany:"تلاش‌های زیاد. ۱۵ دقیقه صبر کن و دوباره تلاش کن.",fpLink:"رمز عبور را فراموش کرده‌ای؟",fpTitle:"بازیابی رمز عبور",fpSub:"ایمیلت را وارد کن تا کد ۶ رقمی برایت بفرستیم.",fpSend:"ارسال کد",rsTitle:"تعیین رمز عبور جدید",rsSub:"کد ارسال‌شده به ایمیلت و رمز عبور جدید را وارد کن.",codePh:"کد ۶ رقمی",newPassPh:"رمز عبور جدید",rsDo:"تعیین رمز عبور",backLogin:"بازگشت به ورود",rsSent:"اگر ایمیل ثبت شده باشد، کد ۶ رقمی ارسال شد. ایمیلت را بررسی کن (و پوشهٔ اسپم).",rsDone:"رمز عبور با موفقیت تغییر کرد ✓ با رمز جدید وارد شو.",errCode:"کد نادرست یا منقضی است. بررسی کن یا کد جدید بخواه.",errShort6:"رمز عبور باید حداقل ۶ نویسه باشد.",blocked:"این توضیح خلاف سیاست محتواست. توضیح دیگری امتحان کن.",manyReq:"درخواست زیاد. کمی صبر کن و دوباره تلاش کن.",sessEnd:"نشست منقضی شد، دوباره وارد شو."},
  ur:{su:"اکاؤنٹ بنائیں",li:"سائن ان",suSub:"اکاؤنٹ بنائیں اور مفت ٹرائل حاصل کریں",liSub:"واپسی پر خوش آمدید",name:"نام",email:"ای میل",pass:"پاس ورڈ",doSu:"اکاؤنٹ بنا کر ٹرائل شروع کریں",doLi:"سائن ان",have:"اکاؤنٹ ہے؟ سائن ان کریں",no:"اکاؤنٹ نہیں؟ بنائیں",trial:"مفت ٹرائل",credits:"بیلنس",left:"مفت کریڈٹ باقی",logout:"لاگ آؤٹ",errFields:"براہ کرم تمام خانے پُر کریں",errEmail:"یہ ای میل پہلے سے رجسٹرڈ ہے",errLogin:"ای میل یا پاس ورڈ غلط ہے",noCredits:"آپ کا مفت ٹرائل ختم — جاری رکھنے کے لیے سبسکرائب کریں",upgrade:"اپ گریڈ",freeCta:"مفت ٹرائل شروع کریں",gate:"مفت ٹرائل شروع کرنے کے لیے اکاؤنٹ بنائیں",demo:"صرف نمونہ — اصل پروڈکٹ میں اکاؤنٹس اور پاس ورڈ محفوظ سرور پر ہونے چاہئیں۔",cost:"لاگت",pricing:"اپنا پلان منتخب کریں",mo:"/ماہ",crM:"کریڈٹ ماہانہ",pop:"سب سے مقبول",allM:"تمام ماڈلز کھلے",subOk:"اب آپ سبسکرائبڈ ہیں ✓",p1:"ابتدائی",p2:"پرو",p3:"بزنس",close:"بند کریں",errTooMany:"بہت زیادہ کوششیں۔ ۱۵ منٹ انتظار کریں اور دوبارہ کوشش کریں۔",fpLink:"پاس ورڈ بھول گئے؟",fpTitle:"پاس ورڈ بحال کریں",fpSub:"اپنا ای میل درج کریں، ہم ۶ ہندسوں کا کوڈ بھیجیں گے۔",fpSend:"کوڈ بھیجیں",rsTitle:"نیا پاس ورڈ مقرر کریں",rsSub:"اپنے ای میل پر بھیجا گیا کوڈ اور نیا پاس ورڈ درج کریں۔",codePh:"۶ ہندسوں کا کوڈ",newPassPh:"نیا پاس ورڈ",rsDo:"پاس ورڈ مقرر کریں",backLogin:"سائن ان پر واپس",rsSent:"اگر ای میل رجسٹرڈ ہے تو ۶ ہندسوں کا کوڈ بھیج دیا گیا۔ اپنا ان باکس (اور اسپام) دیکھیں۔",rsDone:"پاس ورڈ کامیابی سے تبدیل ہو گیا ✓ نئے پاس ورڈ سے سائن ان کریں۔",errCode:"کوڈ غلط یا ختم ہو چکا ہے۔ تصدیق کریں یا نیا کوڈ مانگیں۔",errShort6:"پاس ورڈ کم از کم ۶ حروف کا ہونا چاہیے۔",blocked:"یہ تفصیل مواد کی پالیسی کے خلاف ہے۔ کوئی اور آزمائیں۔",manyReq:"بہت زیادہ درخواستیں۔ تھوڑا انتظار کریں۔",sessEnd:"سیشن ختم ہو گیا، دوبارہ سائن ان کریں۔"},
  tr:{su:"Kayıt ol",li:"Giriş yap",suSub:"Hesabını oluştur ve ücretsiz deneme al",liSub:"Tekrar hoş geldin",name:"Ad",email:"E-posta",pass:"Şifre",doSu:"Hesap oluştur ve denemeyi başlat",doLi:"Giriş yap",have:"Hesabın var mı? Giriş yap",no:"Hesabın yok mu? Oluştur",trial:"Ücretsiz deneme",credits:"Bakiye",left:"ücretsiz kredi kaldı",logout:"Çıkış",errFields:"Lütfen tüm alanları doldur",errEmail:"Bu e-posta zaten kayıtlı",errLogin:"E-posta veya şifre yanlış",noCredits:"Ücretsiz denemen bitti — devam için abone ol",upgrade:"Yükselt",freeCta:"Ücretsiz denemeyi başlat",gate:"Ücretsiz denemeni başlatmak için hesap oluştur",demo:"Sadece demo — gerçek üründe hesaplar ve şifreler güvenli bir sunucuda olmalı.",cost:"Maliyet",pricing:"Planını seç",mo:"/ay",crM:"kredi / ay",pop:"En popüler",allM:"Tüm modeller açık",subOk:"Artık abonesin ✓",p1:"Başlangıç",p2:"Pro",p3:"İşletme",close:"Kapat",errTooMany:"Çok fazla deneme. 15 dakika bekleyip tekrar dene.",fpLink:"Şifreni mi unuttun?",fpTitle:"Şifre sıfırla",fpSub:"E-postanı gir, sana 6 haneli bir kod gönderelim.",fpSend:"Kod gönder",rsTitle:"Yeni şifre belirle",rsSub:"E-postana gelen kodu ve yeni şifreni gir.",codePh:"6 haneli kod",newPassPh:"Yeni şifre",rsDo:"Şifreyi belirle",backLogin:"Girişe dön",rsSent:"E-posta kayıtlıysa 6 haneli kod gönderildi. Gelen kutunu (ve spam) kontrol et.",rsDone:"Şifre başarıyla değiştirildi ✓ Yeni şifrenle giriş yap.",errCode:"Kod yanlış veya süresi dolmuş. Kontrol et ya da yeni kod iste.",errShort6:"Şifre en az 6 karakter olmalı.",blocked:"Bu istem içerik politikasını ihlal ediyor. Başka bir tane dene.",manyReq:"Çok fazla istek. Biraz bekleyip tekrar dene.",sessEnd:"Oturum doldu, tekrar giriş yap."},
  fr:{su:"S'inscrire",li:"Se connecter",suSub:"Crée ton compte et obtiens un essai gratuit",liSub:"Bon retour",name:"Nom",email:"E-mail",pass:"Mot de passe",doSu:"Créer le compte et démarrer l'essai",doLi:"Se connecter",have:"Déjà un compte ? Connecte-toi",no:"Pas de compte ? Crées-en un",trial:"Essai gratuit",credits:"Solde",left:"crédits gratuits restants",logout:"Déconnexion",errFields:"Remplis tous les champs",errEmail:"Cet e-mail est déjà enregistré",errLogin:"E-mail ou mot de passe incorrect",noCredits:"Ton essai gratuit est terminé — abonne-toi pour continuer",upgrade:"Passer au pro",freeCta:"Démarrer l'essai gratuit",gate:"Crée un compte pour démarrer ton essai gratuit",demo:"Démo uniquement — en production, comptes et mots de passe doivent être sur un serveur sécurisé.",cost:"Coût",pricing:"Choisis ton offre",mo:"/mois",crM:"crédits / mois",pop:"Le plus populaire",allM:"Tous les modèles débloqués",subOk:"Tu es abonné ✓",p1:"Starter",p2:"Pro",p3:"Business",close:"Fermer",errTooMany:"Trop de tentatives. Attends 15 minutes et réessaie.",fpLink:"Mot de passe oublié ?",fpTitle:"Réinitialiser le mot de passe",fpSub:"Saisis ton e-mail, on t'envoie un code à 6 chiffres.",fpSend:"Envoyer le code",rsTitle:"Définir un nouveau mot de passe",rsSub:"Saisis le code reçu par e-mail et ton nouveau mot de passe.",codePh:"Code à 6 chiffres",newPassPh:"Nouveau mot de passe",rsDo:"Définir le mot de passe",backLogin:"Retour à la connexion",rsSent:"Si l'e-mail est enregistré, un code à 6 chiffres a été envoyé. Vérifie ta boîte (et les spams).",rsDone:"Mot de passe changé avec succès ✓ Connecte-toi avec le nouveau.",errCode:"Le code est incorrect ou expiré. Vérifie-le ou demandes-en un nouveau.",errShort6:"Le mot de passe doit faire au moins 6 caractères.",blocked:"Ce prompt enfreint la politique de contenu. Essaie-en un autre.",manyReq:"Trop de requêtes. Attends un instant et réessaie.",sessEnd:"Session expirée, reconnecte-toi."},
  es:{su:"Registrarse",li:"Iniciar sesión",suSub:"Crea tu cuenta y obtén una prueba gratis",liSub:"Bienvenido de nuevo",name:"Nombre",email:"Correo",pass:"Contraseña",doSu:"Crear cuenta e iniciar prueba",doLi:"Iniciar sesión",have:"¿Tienes cuenta? Inicia sesión",no:"¿Sin cuenta? Crea una",trial:"Prueba gratis",credits:"Saldo",left:"créditos gratis restantes",logout:"Cerrar sesión",errFields:"Completa todos los campos",errEmail:"Este correo ya está registrado",errLogin:"Correo o contraseña incorrectos",noCredits:"Tu prueba gratis terminó — suscríbete para continuar",upgrade:"Mejorar",freeCta:"Iniciar prueba gratis",gate:"Crea una cuenta para iniciar tu prueba gratis",demo:"Solo demo — en producción, cuentas y contraseñas deben estar en un backend seguro.",cost:"Costo",pricing:"Elige tu plan",mo:"/mes",crM:"créditos / mes",pop:"Más popular",allM:"Todos los modelos desbloqueados",subOk:"Ya estás suscrito ✓",p1:"Inicial",p2:"Pro",p3:"Empresa",close:"Cerrar",errTooMany:"Demasiados intentos. Espera 15 minutos e inténtalo de nuevo.",fpLink:"¿Olvidaste tu contraseña?",fpTitle:"Restablecer contraseña",fpSub:"Escribe tu correo y te enviaremos un código de 6 dígitos.",fpSend:"Enviar código",rsTitle:"Establecer nueva contraseña",rsSub:"Escribe el código enviado a tu correo y tu nueva contraseña.",codePh:"Código de 6 dígitos",newPassPh:"Nueva contraseña",rsDo:"Establecer contraseña",backLogin:"Volver a iniciar sesión",rsSent:"Si el correo está registrado, se envió un código de 6 dígitos. Revisa tu bandeja (y spam).",rsDone:"Contraseña cambiada con éxito ✓ Inicia sesión con la nueva.",errCode:"El código es incorrecto o expiró. Verifícalo o pide uno nuevo.",errShort6:"La contraseña debe tener al menos 6 caracteres.",blocked:"Este prompt infringe la política de contenido. Prueba con otro.",manyReq:"Demasiadas solicitudes. Espera un momento e inténtalo.",sessEnd:"Sesión expirada, inicia sesión de nuevo."},
  de:{su:"Registrieren",li:"Anmelden",suSub:"Erstelle dein Konto und erhalte eine kostenlose Testversion",liSub:"Willkommen zurück",name:"Name",email:"E-Mail",pass:"Passwort",doSu:"Konto erstellen & Test starten",doLi:"Anmelden",have:"Konto vorhanden? Anmelden",no:"Kein Konto? Erstelle eins",trial:"Kostenlose Testversion",credits:"Guthaben",left:"kostenlose Credits übrig",logout:"Abmelden",errFields:"Bitte alle Felder ausfüllen",errEmail:"Diese E-Mail ist bereits registriert",errLogin:"E-Mail oder Passwort falsch",noCredits:"Deine Testversion ist vorbei — abonniere, um fortzufahren",upgrade:"Upgrade",freeCta:"Kostenlose Testversion starten",gate:"Erstelle ein Konto, um deine Testversion zu starten",demo:"Nur Demo — in Produktion müssen Konten und Passwörter auf einem sicheren Server liegen.",cost:"Kosten",pricing:"Wähle deinen Plan",mo:"/Monat",crM:"Credits / Monat",pop:"Am beliebtesten",allM:"Alle Modelle freigeschaltet",subOk:"Du bist abonniert ✓",p1:"Starter",p2:"Pro",p3:"Business",close:"Schließen",errTooMany:"Zu viele Versuche. Warte 15 Minuten und versuch es erneut.",fpLink:"Passwort vergessen?",fpTitle:"Passwort zurücksetzen",fpSub:"Gib deine E-Mail ein, wir senden dir einen 6-stelligen Code.",fpSend:"Code senden",rsTitle:"Neues Passwort festlegen",rsSub:"Gib den per E-Mail gesendeten Code und dein neues Passwort ein.",codePh:"6-stelliger Code",newPassPh:"Neues Passwort",rsDo:"Passwort festlegen",backLogin:"Zurück zur Anmeldung",rsSent:"Wenn die E-Mail registriert ist, wurde ein 6-stelliger Code gesendet. Prüfe dein Postfach (und Spam).",rsDone:"Passwort erfolgreich geändert ✓ Melde dich mit dem neuen an.",errCode:"Der Code ist falsch oder abgelaufen. Prüfe ihn oder fordere einen neuen an.",errShort6:"Das Passwort muss mindestens 6 Zeichen haben.",blocked:"Dieser Prompt verstößt gegen die Inhaltsrichtlinie. Versuch einen anderen.",manyReq:"Zu viele Anfragen. Warte kurz und versuch es erneut.",sessEnd:"Sitzung abgelaufen, melde dich erneut an."},
  ru:{su:"Регистрация",li:"Вход",suSub:"Создайте аккаунт и получите бесплатный пробный период",liSub:"С возвращением",name:"Имя",email:"Эл. почта",pass:"Пароль",doSu:"Создать аккаунт и начать пробу",doLi:"Войти",have:"Есть аккаунт? Войти",no:"Нет аккаунта? Создайте",trial:"Бесплатно",credits:"Баланс",left:"бесплатных кредитов осталось",logout:"Выйти",errFields:"Заполните все поля",errEmail:"Эта почта уже зарегистрирована",errLogin:"Неверная почта или пароль",noCredits:"Пробный период закончился — оформите подписку",upgrade:"Подписка",freeCta:"Начать бесплатно",gate:"Создайте аккаунт, чтобы начать бесплатный период",demo:"Только демо — в продакшене аккаунты и пароли должны храниться на защищённом сервере.",cost:"Стоимость",pricing:"Выберите план",mo:"/мес",crM:"кредитов / мес",pop:"Популярный",allM:"Все модели открыты",subOk:"Вы подписаны ✓",p1:"Старт",p2:"Про",p3:"Бизнес",close:"Закрыть",errTooMany:"Слишком много попыток. Подождите 15 минут и попробуйте снова.",fpLink:"Забыли пароль?",fpTitle:"Сброс пароля",fpSub:"Введите e-mail, и мы отправим вам 6-значный код.",fpSend:"Отправить код",rsTitle:"Задать новый пароль",rsSub:"Введите код из письма и новый пароль.",codePh:"6-значный код",newPassPh:"Новый пароль",rsDo:"Задать пароль",backLogin:"Назад ко входу",rsSent:"Если e-mail зарегистрирован, отправлен 6-значный код. Проверьте почту (и спам).",rsDone:"Пароль успешно изменён ✓ Войдите с новым паролем.",errCode:"Код неверный или истёк. Проверьте его или запросите новый.",errShort6:"Пароль должен быть не короче 6 символов.",blocked:"Этот запрос нарушает правила контента. Попробуйте другой.",manyReq:"Слишком много запросов. Подождите немного.",sessEnd:"Сессия истекла, войдите снова."},
  hi:{su:"साइन अप",li:"साइन इन",suSub:"अपना अकाउंट बनाएँ और मुफ़्त ट्रायल पाएँ",liSub:"वापसी पर स्वागत है",name:"नाम",email:"ईमेल",pass:"पासवर्ड",doSu:"अकाउंट बनाएँ और ट्रायल शुरू करें",doLi:"साइन इन",have:"अकाउंट है? साइन इन करें",no:"अकाउंट नहीं? बनाएँ",trial:"मुफ़्त ट्रायल",credits:"बैलेंस",left:"मुफ़्त क्रेडिट शेष",logout:"लॉग आउट",errFields:"कृपया सभी फ़ील्ड भरें",errEmail:"यह ईमेल पहले से रजिस्टर है",errLogin:"ईमेल या पासवर्ड गलत है",noCredits:"आपका मुफ़्त ट्रायल खत्म — जारी रखने के लिए सब्सक्राइब करें",upgrade:"अपग्रेड",freeCta:"मुफ़्त ट्रायल शुरू करें",gate:"मुफ़्त ट्रायल शुरू करने के लिए अकाउंट बनाएँ",demo:"केवल डेमो — असली प्रोडक्ट में अकाउंट और पासवर्ड सुरक्षित सर्वर पर होने चाहिए।",cost:"लागत",pricing:"अपना प्लान चुनें",mo:"/माह",crM:"क्रेडिट / माह",pop:"सबसे लोकप्रिय",allM:"सभी मॉडल अनलॉक",subOk:"अब आप सब्सक्राइब्ड हैं ✓",p1:"स्टार्टर",p2:"प्रो",p3:"बिज़नेस",close:"बंद करें",errTooMany:"बहुत ज़्यादा कोशिशें। 15 मिनट रुकें और फिर कोशिश करें।",fpLink:"पासवर्ड भूल गए?",fpTitle:"पासवर्ड रीसेट करें",fpSub:"अपना ईमेल डालें, हम आपको 6 अंकों का कोड भेजेंगे।",fpSend:"कोड भेजें",rsTitle:"नया पासवर्ड सेट करें",rsSub:"अपने ईमेल पर भेजा गया कोड और नया पासवर्ड डालें।",codePh:"6 अंकों का कोड",newPassPh:"नया पासवर्ड",rsDo:"पासवर्ड सेट करें",backLogin:"साइन इन पर वापस",rsSent:"अगर ईमेल रजिस्टर्ड है तो 6 अंकों का कोड भेज दिया गया। अपना इनबॉक्स (और स्पैम) देखें।",rsDone:"पासवर्ड सफलतापूर्वक बदला गया ✓ नए पासवर्ड से साइन इन करें।",errCode:"कोड गलत या समाप्त है। जाँचें या नया कोड मांगें।",errShort6:"पासवर्ड कम से कम 6 अक्षर का होना चाहिए।",blocked:"यह प्रॉम्प्ट कंटेंट नीति का उल्लंघन करता है। दूसरा आज़माएँ।",manyReq:"बहुत ज़्यादा अनुरोध। थोड़ा रुकें और फिर कोशिश करें।",sessEnd:"सेशन समाप्त, फिर से साइन इन करें।"},
};

const STYLE_IDS = [
  { id: "cinematic", k:"cinematic", en: "cinematic film still, dramatic lighting, 35mm, shallow depth of field" },
  { id: "photoreal", k:"photoreal", en: "ultra photorealistic, natural light, high detail, 50mm lens" },
  { id: "anime", k:"anime", en: "anime style, vibrant colors, clean lineart, studio quality" },
  { id: "3d", k:"td", en: "3D render, octane, soft global illumination, pixar-like" },
  { id: "neon", k:"neon", en: "neon cyberpunk, glowing lights, moody atmosphere, reflections" },
  { id: "minimal", k:"minimal", en: "minimalist, clean composition, soft pastel palette, lots of negative space" },
];

// ===== قوالب جاهزة =====
const TPL_CATS = [
  { id:"portrait", label:{ ar:"بورتريه وأشخاص", en:"Portraits", ku:"پۆرتریت", fa:"چهره‌ها", ur:"پورٹریٹ", tr:"Portreler", fr:"Portraits", es:"Retratos", de:"Porträts", ru:"Портреты", hi:"पोर्ट्रेट" } },
  { id:"business", label:{ ar:"تجاري", en:"Business", ku:"بازرگانی", fa:"تجاری", ur:"کاروبار", tr:"İş", fr:"Business", es:"Negocios", de:"Business", ru:"Бизнес", hi:"व्यापार" } },
  { id:"art", label:{ ar:"فني وإبداعي", en:"Art", ku:"هونەری", fa:"هنری", ur:"فن", tr:"Sanat", fr:"Art", es:"Arte", de:"Kunst", ru:"Арт", hi:"कला" } },
  { id:"nature", label:{ ar:"مناظر وطبيعة", en:"Nature", ku:"سروشت", fa:"طبیعت", ur:"مناظر", tr:"Doğa", fr:"Nature", es:"Naturaleza", de:"Natur", ru:"Природа", hi:"प्रकृति" } },
];
const TEMPLATES = [
  // بورتريه
  { cat:"portrait", style:"photoreal", titleAr:"بورتريه احترافي", titleEn:"Professional portrait", promptAr:"بورتريه احترافي لشخص، إضاءة استوديو ناعمة، خلفية أنيقة سادة، تفاصيل دقيقة، نظرة واثقة", promptEn:"professional studio portrait of a person, soft lighting, elegant plain background, sharp details, confident look" },
  { cat:"portrait", style:"photoreal", titleAr:"صورة رسمية للأعمال", titleEn:"Business headshot", promptAr:"صورة شخصية رسمية بملابس أنيقة، خلفية نظيفة، إضاءة طبيعية، ابتسامة احترافية", promptEn:"formal business headshot, smart attire, clean background, natural lighting, professional smile" },
  { cat:"portrait", style:"cinematic", titleAr:"بورتريه سينمائي", titleEn:"Cinematic portrait", promptAr:"بورتريه سينمائي درامي، إضاءة جانبية، أجواء غامضة، ألوان دافئة عميقة", promptEn:"dramatic cinematic portrait, side lighting, moody atmosphere, deep warm tones" },
  { cat:"portrait", style:"photoreal", titleAr:"بورتريه أبيض وأسود", titleEn:"B&W portrait", promptAr:"بورتريه فني بالأبيض والأسود، تباين عالٍ، إضاءة درامية، تعبير عميق", promptEn:"artistic black and white portrait, high contrast, dramatic lighting, deep expression" },
  // تجاري
  { cat:"business", style:"minimal", titleAr:"شعار حديث", titleEn:"Modern logo", promptAr:"شعار حديث بسيط لعلامة تجارية، تصميم أنيق، ألوان متناسقة، خلفية نظيفة", promptEn:"modern minimalist brand logo, elegant design, harmonious colors, clean background" },
  { cat:"business", style:"photoreal", titleAr:"صورة منتج", titleEn:"Product shot", promptAr:"صورة منتج احترافية، إضاءة استوديو، خلفية بيضاء، زاوية جذابة، تفاصيل واضحة", promptEn:"professional product photography, studio lighting, white background, attractive angle, crisp details" },
  { cat:"business", style:"minimal", titleAr:"إعلان سوشيال ميديا", titleEn:"Social media ad", promptAr:"تصميم إعلان جذّاب لوسائل التواصل الاجتماعي، ألوان زاهية، تكوين عصري أنيق", promptEn:"eye-catching social media ad design, vibrant colors, modern elegant composition" },
  { cat:"business", style:"minimal", titleAr:"خلفية أعمال", titleEn:"Business background", promptAr:"خلفية مجرّدة أنيقة للأعمال، تدرّجات ناعمة، تصميم عصري احترافي", promptEn:"elegant abstract business background, soft gradients, modern professional design" },
  // فني
  { cat:"art", style:"cinematic", titleAr:"فن رقمي خيالي", titleEn:"Fantasy art", promptAr:"لوحة فنية رقمية خيالية ملحمية، ألوان زاهية، تفاصيل غنية، أجواء ساحرة", promptEn:"epic fantasy digital painting, vibrant colors, rich detail, magical atmosphere" },
  { cat:"art", style:"anime", titleAr:"شخصية أنمي", titleEn:"Anime character", promptAr:"شخصية أنمي بتصميم احترافي، ألوان نابضة بالحياة، خطوط نظيفة، جودة استوديو", promptEn:"professional anime character design, vibrant colors, clean lineart, studio quality" },
  { cat:"art", style:"neon", titleAr:"مدينة سايبربانك", titleEn:"Cyberpunk city", promptAr:"مدينة مستقبلية سايبربانك ليلاً، أضواء نيون متوهّجة، أجواء ممطرة، انعكاسات", promptEn:"futuristic cyberpunk city at night, glowing neon lights, rainy mood, reflections" },
  { cat:"art", style:"minimal", titleAr:"فن تجريدي", titleEn:"Abstract art", promptAr:"فن تجريدي ملوّن، أشكال هندسية، تدرّجات جميلة، تكوين متوازن", promptEn:"colorful abstract art, geometric shapes, beautiful gradients, balanced composition" },
  // طبيعة
  { cat:"nature", style:"cinematic", titleAr:"منظر عند الغروب", titleEn:"Sunset landscape", promptAr:"منظر طبيعي خلّاب عند الغروب، جبال وبحيرة، إضاءة ذهبية دافئة", promptEn:"breathtaking landscape at sunset, mountains and lake, warm golden light" },
  { cat:"nature", style:"photoreal", titleAr:"غابة ضبابية", titleEn:"Misty forest", promptAr:"غابة كثيفة ضبابية في الصباح، أشعة شمس بين الأشجار، أجواء هادئة", promptEn:"dense misty forest in the morning, sun rays through trees, calm atmosphere" },
  { cat:"nature", style:"photoreal", titleAr:"شاطئ استوائي", titleEn:"Tropical beach", promptAr:"شاطئ استوائي، مياه فيروزية صافية، رمال بيضاء، سماء زرقاء", promptEn:"tropical beach, clear turquoise water, white sand, blue sky" },
  { cat:"nature", style:"cinematic", titleAr:"سماء النجوم", titleEn:"Starry sky", promptAr:"سماء ليلية مليئة بالنجوم والمجرّة، جبال عند الأفق، أجواء ساحرة", promptEn:"night sky full of stars and the milky way, mountains on the horizon, magical mood" },
];
const L_TEMPLATES = { ar:"قوالب جاهزة", en:"Templates", ku:"قاڵبە ئامادەکان", fa:"قالب‌های آماده", ur:"تیار ٹیمپلیٹس", tr:"Şablonlar", fr:"Modèles", es:"Plantillas", de:"Vorlagen", ru:"Шаблоны", hi:"टेम्पलेट" };
const L_TPL_TITLE = { ar:"اختر قالباً للبدء", en:"Pick a template to start", ku:"قاڵبێک هەڵبژێرە", fa:"یک قالب انتخاب کنید", ur:"شروع کرنے کے لیے ٹیمپلیٹ چنیں", tr:"Başlamak için bir şablon seçin", fr:"Choisissez un modèle", es:"Elige una plantilla", de:"Wähle eine Vorlage", ru:"Выберите шаблон", hi:"शुरू करने के लिए टेम्पलेट चुनें" };
const L_REF_TITLE = { ar:"ادعُ أصدقاءك", en:"Invite your friends", ku:"بانگهێشتی هاوڕێکانت بکە", fa:"دوستان خود را دعوت کنید", ur:"دوستوں کو مدعو کریں", tr:"Arkadaşlarını davet et", fr:"Invitez vos amis", es:"Invita a tus amigos", de:"Lade deine Freunde ein", ru:"Пригласи друзей", hi:"अपने दोस्तों को आमंत्रित करें" };
const L_REF_DESC = { ar:"شارك رابطك، وعند تسجيل صديقك وتفعيل بريده يحصل كلاكما على رصيد مجاني!", en:"Share your link. When a friend signs up and verifies their email, you both get free credits!", ku:"لینکەکەت هاوبەش بکە. کاتێک هاوڕێیەکت خۆی تۆمار دەکات، هەردووکتان کرێدیتی بەخۆڕایی وەردەگرن!", fa:"لینک خود را به اشتراک بگذارید. وقتی دوستتان ثبت‌نام و ایمیلش را تأیید کند، هر دو اعتبار رایگان می‌گیرید!", ur:"اپنا لنک شیئر کریں۔ جب آپ کا دوست سائن اپ اور ای میل تصدیق کرے گا، دونوں کو مفت کریڈٹ ملے گا!", tr:"Bağlantını paylaş. Bir arkadaşın kaydolup e-postasını doğruladığında ikiniz de ücretsiz kredi kazanırsınız!", fr:"Partagez votre lien. Quand un ami s'inscrit et vérifie son e-mail, vous recevez tous les deux des crédits gratuits !", es:"Comparte tu enlace. Cuando un amigo se registre y verifique su correo, ¡ambos reciben créditos gratis!", de:"Teile deinen Link. Wenn ein Freund sich registriert und seine E-Mail bestätigt, erhaltet ihr beide Gratis-Guthaben!", ru:"Поделись ссылкой. Когда друг зарегистрируется и подтвердит почту, вы оба получите бесплатные кредиты!", hi:"अपना लिंक साझा करें। जब आपका दोस्त साइन अप और ईमेल सत्यापित करेगा, दोनों को मुफ्त क्रेडिट मिलेगा!" };
const L_REF_COUNT = { ar:"صديق انضم عبر رابطك", en:"friends joined via your link", ku:"هاوڕێ بە لینکەکەت پەیوەست بوون", fa:"دوست از طریق لینک شما", ur:"دوست آپ کے لنک سے شامل ہوئے", tr:"arkadaş bağlantınla katıldı", fr:"amis via votre lien", es:"amigos se unieron por tu enlace", de:"Freunde über deinen Link", ru:"друзей по вашей ссылке", hi:"दोस्त आपके लिंक से जुड़े" };
const L_REF_INVITE_MSG = { ar:"جرّب طيف لتوليد الصور والفيديو بالذكاء الاصطناعي! سجّل عبر رابطي ونحصل كلانا على رصيد مجاني", en:"Try Tayf for AI image & video generation! Sign up with my link and we both get free credits", ku:"تایف تاقی بکەرەوە بۆ دروستکردنی وێنە و ڤیدیۆ! بە لینکەکەم تۆمار بکە", fa:"تایف را برای ساخت تصویر و ویدیو امتحان کن! با لینک من ثبت‌نام کن", ur:"AI تصویر اور ویڈیو کے لیے طیف آزمائیں! میرے لنک سے سائن اپ کریں", tr:"Yapay zeka ile görsel ve video için Tayf'ı dene! Bağlantımla kaydol", fr:"Essaie Tayf pour générer images et vidéos par IA ! Inscris-toi avec mon lien", es:"¡Prueba Tayf para generar imágenes y videos con IA! Regístrate con mi enlace", de:"Probiere Tayf für KI-Bilder und -Videos! Melde dich mit meinem Link an", ru:"Попробуй Tayf для генерации изображений и видео ИИ! Зарегистрируйся по моей ссылке", hi:"AI छवि और वीडियो के लिए Tayf आज़माएं! मेरे लिंक से साइन अप करें" };
const L_REF_BONUS_TAG = { ar:"رصيد لكل طرف", en:"credits each", ku:"کرێدیت بۆ هەریەک", fa:"اعتبار برای هرکدام", ur:"ہر ایک کے لیے کریڈٹ", tr:"her biri için kredi", fr:"crédits chacun", es:"créditos cada uno", de:"Guthaben je", ru:"кредитов каждому", hi:"क्रेडिट प्रत्येक" };

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
const L_EDIT = { ar:"تعديل الصورة", en:"Edit image", ku:"دەستکاری وێنە", fa:"ویرایش تصویر", ur:"تصویر میں ترمیم", tr:"Görseli düzenle", fr:"Modifier l'image", es:"Editar imagen", de:"Bild bearbeiten", ru:"Редактировать", hi:"छवि संपादित करें" };
const L_SHARE = { ar:"مشاركة", en:"Share", ku:"هاوبەشکردن", fa:"اشتراک‌گذاری", ur:"شیئر کریں", tr:"Paylaş", fr:"Partager", es:"Compartir", de:"Teilen", ru:"Поделиться", hi:"साझा करें" };
const L_COPY_LINK = { ar:"نسخ الرابط", en:"Copy link", ku:"لینک کۆپی بکە", fa:"کپی لینک", ur:"لنک کاپی کریں", tr:"Bağlantıyı kopyala", fr:"Copier le lien", es:"Copiar enlace", de:"Link kopieren", ru:"Копировать ссылку", hi:"लिंक कॉपी करें" };
const L_COPIED = { ar:"تم النسخ ✓", en:"Copied ✓", ku:"کۆپی کرا ✓", fa:"کپی شد ✓", ur:"کاپی ہو گیا ✓", tr:"Kopyalandı ✓", fr:"Copié ✓", es:"Copiado ✓", de:"Kopiert ✓", ru:"Скопировано ✓", hi:"कॉपी हो गया ✓" };
const L_SHARE_VIA = { ar:"مشاركة العمل عبر", en:"Share via", ku:"هاوبەشکردن بە", fa:"اشتراک از طریق", ur:"اس کے ذریعے شیئر کریں", tr:"Şununla paylaş", fr:"Partager via", es:"Compartir vía", de:"Teilen über", ru:"Поделиться через", hi:"इसके माध्यम से साझा करें" };
const L_FAV_ADD = { ar:"أضف للمفضّلة", en:"Add to favorites", ku:"زیادکردن بۆ دڵخوازەکان", fa:"افزودن به علاقه‌مندی‌ها", ur:"پسندیدہ میں شامل کریں", tr:"Favorilere ekle", fr:"Ajouter aux favoris", es:"Añadir a favoritos", de:"Zu Favoriten", ru:"В избранное", hi:"पसंदीदा में जोड़ें" };
const L_FAV_REMOVE = { ar:"إزالة من المفضّلة", en:"Remove from favorites", ku:"لابردن لە دڵخوازەکان", fa:"حذف از علاقه‌مندی‌ها", ur:"پسندیدہ سے ہٹائیں", tr:"Favorilerden çıkar", fr:"Retirer des favoris", es:"Quitar de favoritos", de:"Aus Favoriten entfernen", ru:"Из избранного", hi:"पसंदीदा से हटाएं" };
const L_ALL = { ar:"الكل", en:"All", ku:"هەموو", fa:"همه", ur:"سب", tr:"Tümü", fr:"Tout", es:"Todo", de:"Alle", ru:"Все", hi:"सभी" };
const L_FAVS = { ar:"المفضّلة", en:"Favorites", ku:"دڵخوازەکان", fa:"علاقه‌مندی‌ها", ur:"پسندیدہ", tr:"Favoriler", fr:"Favoris", es:"Favoritos", de:"Favoriten", ru:"Избранное", hi:"पसंदीदा" };
const L_NO_FAVS = { ar:"لا توجد أعمال في المفضّلة بعد. اضغط ★ على أي عمل لإضافته.", en:"No favorites yet. Tap ★ on any creation to add it.", ku:"هیچ دڵخوازێک نییە. ★ بکە لەسەر هەر کارێک.", fa:"هنوز موردی نیست. روی ★ هر اثر بزنید.", ur:"ابھی کوئی پسندیدہ نہیں۔ کسی کام پر ★ دبائیں۔", tr:"Henüz favori yok. Bir esere ★ dokunun.", fr:"Aucun favori. Touchez ★ sur une création.", es:"Sin favoritos. Toca ★ en una creación.", de:"Keine Favoriten. Tippe auf ★.", ru:"Нет избранного. Нажмите ★ на работе.", hi:"कोई पसंदीदा नहीं। किसी कृति पर ★ दबाएं।" };
const L_DL = { ar:"تنزيل", en:"Download", ku:"داگرتن", fa:"دانلود", ur:"ڈاؤن لوڈ", tr:"İndir", fr:"Télécharger", es:"Descargar", de:"Herunterladen", ru:"Скачать", hi:"डाउनलोड" };
const F_TERMS = { ar:"الشروط والأحكام", en:"Terms", ku:"مەرجەکان", fa:"شرایط", ur:"شرائط و ضوابط" };
const F_PRIVACY = { ar:"سياسة الخصوصية", en:"Privacy", ku:"تایبەتمەندی", fa:"حریم خصوصی", ur:"رازداری" };
const F_FAQ = { ar:"الأسئلة الشائعة", en:"FAQ", ku:"پرسیارە دووبارەکان", fa:"سؤالات متداول", ur:"عمومی سوالات", tr:"SSS", fr:"FAQ", es:"Preguntas frecuentes", de:"FAQ", ru:"Вопросы", hi:"सामान्य प्रश्न" };
const F_CONTACT = { ar:"تواصل معنا", en:"Contact", ku:"پەیوەندیمان پێوە بکە", fa:"تماس با ما", ur:"رابطہ کریں", tr:"İletişim", fr:"Contact", es:"Contacto", de:"Kontakt", ru:"Контакты", hi:"संपर्क करें" };
const F_CONTACT_SUB = { ar:"نسعد بتواصلك معنا عبر أي وسيلة", en:"We'd love to hear from you on any channel", ku:"خۆشحاڵ دەبین بە پەیوەندیت لە هەر ڕێگایەکەوە", fa:"خوشحال می‌شویم از هر راهی با ما در تماس باشید", ur:"کسی بھی ذریعے سے ہم سے رابطہ کریں", tr:"Her kanaldan bize ulaşabilirsiniz", fr:"Contactez-nous par le canal de votre choix", es:"Contáctanos por cualquier medio", de:"Erreichen Sie uns über jeden Kanal", ru:"Свяжитесь с нами любым удобным способом", hi:"किसी भी माध्यम से हमसे संपर्क करें" };
const F_RIGHTS = { ar:"جميع الحقوق محفوظة", en:"All rights reserved", ku:"هەموو مافەکان پارێزراون", fa:"همه حقوق محفوظ است", ur:"جملہ حقوق محفوظ ہیں" };

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

// قاموس قسم الأرشيف (أعمالي)
const ARCH = {
  ar:{ title:"أعمالي", empty:"لا توجد أعمال بعد. ولّد صورة أو فيديو وستظهر هنا تلقائياً.", loginFirst:"سجّل الدخول لعرض أعمالك.", loading:"جارٍ التحميل…", copyPrompt:"نسخ الوصف", copied:"تم النسخ ✓", del:"حذف", confirmDel:"حذف هذا العمل؟", origPrompt:"وصفك", enPrompt:"الوصف الإنجليزي", refresh:"تحديث" },
  en:{ title:"My creations", empty:"No creations yet. Generate an image or video and it'll appear here automatically.", loginFirst:"Sign in to view your creations.", loading:"Loading…", copyPrompt:"Copy prompt", copied:"Copied ✓", del:"Delete", confirmDel:"Delete this creation?", origPrompt:"Your prompt", enPrompt:"English prompt", refresh:"Refresh" },
  ku:{ title:"کارەکانم", empty:"هێشتا هیچ کارێک نییە. وێنە یان ڤیدیۆیەک دروست بکە و لێرە دەردەکەوێت.", loginFirst:"بچۆ ژوورەوە بۆ بینینی کارەکانت.", loading:"باردەکرێت…", copyPrompt:"کۆپی وەسف", copied:"کۆپی کرا ✓", del:"سڕینەوە", confirmDel:"ئەم کارە بسڕێتەوە؟", origPrompt:"وەسفەکەت", enPrompt:"وەسفی ئینگلیزی", refresh:"نوێکردنەوە" },
  fa:{ title:"ساخته‌های من", empty:"هنوز چیزی نساخته‌ای. یک تصویر یا ویدیو بساز تا اینجا ظاهر شود.", loginFirst:"برای دیدن ساخته‌هایت وارد شو.", loading:"در حال بارگذاری…", copyPrompt:"کپی توضیح", copied:"کپی شد ✓", del:"حذف", confirmDel:"این مورد حذف شود؟", origPrompt:"توضیح تو", enPrompt:"توضیح انگلیسی", refresh:"تازه‌سازی" },
  ur:{ title:"میری تخلیقات", empty:"ابھی کوئی تخلیق نہیں۔ تصویر یا ویڈیو بنائیں، یہاں خودبخود ظاہر ہوگی۔", loginFirst:"اپنی تخلیقات دیکھنے کے لیے سائن ان کریں۔", loading:"لوڈ ہو رہا ہے…", copyPrompt:"تفصیل کاپی کریں", copied:"کاپی ہو گیا ✓", del:"حذف", confirmDel:"یہ تخلیق حذف کریں؟", origPrompt:"آپ کی تفصیل", enPrompt:"انگریزی تفصیل", refresh:"ریفریش" },
  tr:{ title:"Yapımlarım", empty:"Henüz yapım yok. Bir görsel veya video üret, burada otomatik görünecek.", loginFirst:"Yapımlarını görmek için giriş yap.", loading:"Yükleniyor…", copyPrompt:"İstemi kopyala", copied:"Kopyalandı ✓", del:"Sil", confirmDel:"Bu yapım silinsin mi?", origPrompt:"İstemin", enPrompt:"İngilizce istem", refresh:"Yenile" },
  fr:{ title:"Mes créations", empty:"Aucune création pour l'instant. Génère une image ou vidéo, elle apparaîtra ici.", loginFirst:"Connecte-toi pour voir tes créations.", loading:"Chargement…", copyPrompt:"Copier le prompt", copied:"Copié ✓", del:"Supprimer", confirmDel:"Supprimer cette création ?", origPrompt:"Ton prompt", enPrompt:"Prompt anglais", refresh:"Actualiser" },
  es:{ title:"Mis creaciones", empty:"Aún no hay creaciones. Genera una imagen o video y aparecerá aquí.", loginFirst:"Inicia sesión para ver tus creaciones.", loading:"Cargando…", copyPrompt:"Copiar prompt", copied:"Copiado ✓", del:"Eliminar", confirmDel:"¿Eliminar esta creación?", origPrompt:"Tu prompt", enPrompt:"Prompt en inglés", refresh:"Actualizar" },
  de:{ title:"Meine Werke", empty:"Noch keine Werke. Generiere ein Bild oder Video, es erscheint hier automatisch.", loginFirst:"Melde dich an, um deine Werke zu sehen.", loading:"Wird geladen…", copyPrompt:"Prompt kopieren", copied:"Kopiert ✓", del:"Löschen", confirmDel:"Dieses Werk löschen?", origPrompt:"Dein Prompt", enPrompt:"Englischer Prompt", refresh:"Aktualisieren" },
  ru:{ title:"Мои работы", empty:"Пока нет работ. Создайте изображение или видео — они появятся здесь.", loginFirst:"Войдите, чтобы увидеть свои работы.", loading:"Загрузка…", copyPrompt:"Копировать промпт", copied:"Скопировано ✓", del:"Удалить", confirmDel:"Удалить эту работу?", origPrompt:"Ваш промпт", enPrompt:"Английский промпт", refresh:"Обновить" },
  hi:{ title:"मेरी कृतियाँ", empty:"अभी कोई कृति नहीं। एक तस्वीर या वीडियो बनाएँ, यहाँ अपने आप दिखेगी।", loginFirst:"अपनी कृतियाँ देखने के लिए साइन इन करें।", loading:"लोड हो रहा है…", copyPrompt:"प्रॉम्प्ट कॉपी करें", copied:"कॉपी हो गया ✓", del:"हटाएँ", confirmDel:"यह कृति हटाएँ?", origPrompt:"आपका प्रॉम्प्ट", enPrompt:"अंग्रेज़ी प्रॉम्प्ट", refresh:"रिफ्रेश" },
};

export default function App() {
  const [lang, setLang] = useState("ar");
  const [langOpen, setLangOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [mode, setMode] = useState("image");
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("cinematic");
  const [ratio, setRatio] = useState("9:16");
  const [count, setCount] = useState(1);
  const [vModel, setVModel] = useState(FREE_MODEL);
  const [duration, setDuration] = useState(5);
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
  // ---- الأرشيف (أعمالي) ----
  const [creations, setCreations] = useState([]);
  const [favOnly, setFavOnly] = useState(false);
  const [editorSrc, setEditorSrc] = useState(null);
  const [shareUrl, setShareUrl] = useState(null);
  const [shareCopied, setShareCopied] = useState(false);
  const [templatesOpen, setTemplatesOpen] = useState(false);
  const [tplCat, setTplCat] = useState("portrait");
  const [refFromUrl, setRefFromUrl] = useState("");
  const [myRef, setMyRef] = useState(null);
  const [refCopied, setRefCopied] = useState(false);
  const [archLoading, setArchLoading] = useState(false);
  const [copiedId, setCopiedId] = useState("");
  const taRef = useRef(null);
  const spectrumRef = useRef(null);

  // ---- لوحة الأدمن ----
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [adminStats, setAdminStats] = useState(null);
  const [adminUsers, setAdminUsers] = useState([]);
  const [adminSearch, setAdminSearch] = useState("");
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminErr, setAdminErr] = useState("");
  const [adminBusy, setAdminBusy] = useState("");

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
  const [fCode, setFCode] = useState("");
  const [contactOpen, setContactOpen] = useState(false);
  const [authErr, setAuthErr] = useState("");
  const [noCredit, setNoCredit] = useState(false);
  const a = AUTH[lang];
  const ac = ACCT[lang];
  const ar = ARCH[lang];

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
    setFName(""); setFEmail(""); setFPass(""); setFCode(""); setAuthOpen(true);
  }

  // طلب رمز استعادة كلمة المرور
  async function forgotPassword() {
    if (authBusy) return;
    setAuthErr(""); setAuthNote("");
    const email = fEmail.trim().toLowerCase();
    if (!email) { setAuthErr(a.errFields); return; }
    setAuthBusy(true);
    try {
      const r = await fetch(API_BASE + "/api/forgot-password", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok && (d.error === "TOO_MANY_ATTEMPTS" || d.error === "TOO_MANY_REQUESTS")) {
        setAuthErr(a.errTooMany); return;
      }
      // ننتقل لشاشة إدخال الرمز (الرد عام دائماً)
      setAuthMode("reset"); setFCode(""); setFPass("");
      setAuthNote(a.rsSent);
    } catch (e) {
      setAuthErr(t.errConn || "تعذّر الاتصال بالخادم.");
    } finally { setAuthBusy(false); }
  }

  // إعادة تعيين كلمة المرور بالرمز
  async function resetPassword() {
    if (authBusy) return;
    setAuthErr(""); setAuthNote("");
    const email = fEmail.trim().toLowerCase();
    if (!email || !fCode.trim() || !fPass) { setAuthErr(a.errFields); return; }
    if (fPass.length < 6) { setAuthErr(a.errShort6); return; }
    setAuthBusy(true);
    try {
      const r = await fetch(API_BASE + "/api/reset-password", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: fCode.trim(), newPassword: fPass }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) {
        if (d.error === "INVALID_CODE") setAuthErr(a.errCode);
        else if (d.error === "PASSWORD_TOO_SHORT") setAuthErr(a.errShort6);
        else if (d.error === "TOO_MANY_ATTEMPTS" || d.error === "TOO_MANY_REQUESTS")
          setAuthErr(a.errTooMany);
        else setAuthErr(t.errConn || a.sessEnd);
        return;
      }
      // نجح — نرجع لتسجيل الدخول
      setAuthMode("login"); setFPass(""); setFCode("");
      setAuthNote(a.rsDone);
    } catch (e) {
      setAuthErr(t.errConn || "تعذّر الاتصال بالخادم.");
    } finally { setAuthBusy(false); }
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
          body: JSON.stringify({ name: fName.trim(), email, password: fPass, ref: refFromUrl || undefined }),
        });
        const d = await r.json().catch(() => ({}));
        if (!r.ok) {
          if (d.error === "EMAIL_EXISTS") setAuthErr(a.errEmail);
          else if (d.error === "DISPOSABLE_EMAIL") setAuthErr(a.errEmail);
          else if (d.error === "TOO_MANY_ATTEMPTS" || d.error === "TOO_MANY_REQUESTS")
            setAuthErr(a.errTooMany);
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
          else if (d.error === "TOO_MANY_ATTEMPTS" || d.error === "TOO_MANY_REQUESTS")
            setAuthErr(a.errTooMany);
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

  function logout() { saveSession(null, null); setIsAdmin(false); setAdminOpen(false); }

  // ---- دوال لوحة الأدمن ----
  async function checkAdmin(tok) {
    try {
      const r = await fetch(API_BASE + "/api/admin/check", {
        headers: { Authorization: "Bearer " + (tok || token) },
      });
      const d = await r.json();
      setIsAdmin(!!d.isAdmin);
    } catch (e) { setIsAdmin(false); }
  }

  async function adminReload() {
    try {
      const [sr, ur] = await Promise.all([
        fetch(API_BASE + "/api/admin/stats", { headers: { Authorization: "Bearer " + token } }),
        fetch(API_BASE + "/api/admin/users", { headers: { Authorization: "Bearer " + token } }),
      ]);
      const sd = await sr.json();
      const ud = await ur.json();
      setAdminStats(sd.stats);
      setAdminUsers(ud.users || []);
    } catch (e) {}
  }

  async function openAdmin() {
    setAdminOpen(true);
    setAdminErr(""); setAdminLoading(true);
    try {
      await adminReload();
    } catch (e) {
      setAdminErr("تعذّر تحميل بيانات اللوحة. حاول مرة أخرى.");
    } finally {
      setAdminLoading(false);
    }
  }

  async function adminAddCredits(email, delta) {
    setAdminBusy(email); setAdminErr("");
    try {
      const r = await fetch(API_BASE + "/api/admin/credits", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
        body: JSON.stringify({ email, delta }),
      });
      if (!r.ok) throw new Error();
      await adminReload();
    } catch (e) {
      setAdminErr("تعذّر تعديل الرصيد.");
    } finally { setAdminBusy(""); }
  }

  async function adminSetCredits(email) {
    const val = window.prompt("اكتب الرصيد الجديد لـ " + email + ":");
    if (val == null) return;
    const num = Number(val);
    if (!Number.isFinite(num) || num < 0) { setAdminErr("قيمة غير صحيحة."); return; }
    setAdminBusy(email); setAdminErr("");
    try {
      const r = await fetch(API_BASE + "/api/admin/credits", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
        body: JSON.stringify({ email, set: num }),
      });
      if (!r.ok) throw new Error();
      await adminReload();
    } catch (e) {
      setAdminErr("تعذّر تعيين الرصيد.");
    } finally { setAdminBusy(""); }
  }

  async function adminToggleSub(email, current) {
    setAdminBusy(email); setAdminErr("");
    try {
      const r = await fetch(API_BASE + "/api/admin/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
        body: JSON.stringify({ email, subscribed: !current }),
      });
      if (!r.ok) throw new Error();
      await adminReload();
    } catch (e) {
      setAdminErr("تعذّر تغيير الاشتراك.");
    } finally { setAdminBusy(""); }
  }

  async function adminRemoveUser(email) {
    if (!window.confirm("حذف المستخدم " + email + " نهائياً مع كل أعماله؟ لا يمكن التراجع.")) return;
    setAdminBusy(email); setAdminErr("");
    try {
      const r = await fetch(API_BASE + "/api/admin/users/" + encodeURIComponent(email), {
        method: "DELETE",
        headers: { Authorization: "Bearer " + token },
      });
      if (!r.ok) throw new Error();
      await adminReload();
    } catch (e) {
      setAdminErr("تعذّر حذف المستخدم.");
    } finally { setAdminBusy(""); }
  }

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

  // جلب أعمال المستخدم من الخادم
  async function loadCreations() {
    if (!token) return;
    setArchLoading(true);
    try {
      const r = await fetch(API_BASE + "/api/creations", {
        headers: { Authorization: "Bearer " + token },
      });
      const d = await r.json().catch(() => ({}));
      if (r.ok && Array.isArray(d.creations)) setCreations(d.creations);
    } catch (e) {} finally { setArchLoading(false); }
  }

  // حذف عمل من الأرشيف
  async function removeCreation(id) {
    if (!token) return;
    if (typeof window !== "undefined" && !window.confirm(ar.confirmDel)) return;
    try {
      const r = await fetch(API_BASE + "/api/creations/" + id, {
        method: "DELETE",
        headers: { Authorization: "Bearer " + token },
      });
      if (r.ok) setCreations((list) => list.filter((c) => c.id !== id));
    } catch (e) {}
  }

  // نسخ رابط المشاركة
  async function copyShareLink(url) {
    try {
      await navigator.clipboard.writeText(url);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 1800);
    } catch (e) {
      // بديل: تحديد نص مؤقت
      const ta = document.createElement("textarea");
      ta.value = url; document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); setShareCopied(true); setTimeout(() => setShareCopied(false), 1800); } catch (_) {}
      document.body.removeChild(ta);
    }
  }

  // رابط الإحالة الكامل
  function refLink() {
    return myRef && myRef.code ? `https://tayf.art/?ref=${myRef.code}` : "";
  }
  async function copyRefLink() {
    const url = refLink(); if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setRefCopied(true); setTimeout(() => setRefCopied(false), 1800);
    } catch (e) {
      const ta = document.createElement("textarea");
      ta.value = url; document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); setRefCopied(true); setTimeout(() => setRefCopied(false), 1800); } catch (_) {}
      document.body.removeChild(ta);
    }
  }

  // تطبيق قالب جاهز: يعبّي الوصف والنمط
  function applyTemplate(tpl) {    const p = lang === "ar" ? tpl.promptAr : tpl.promptEn;
    setPrompt(p);
    if (tpl.style) setStyle(tpl.style);
    setMode("image");
    setEnhanced("");
    setTemplatesOpen(false);
    // نمرّر للمولّد ونركّز على مربّع الوصف
    setTimeout(() => {
      const el = document.getElementById("studio");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 60);
  }

  // تبديل المفضّلة لعمل (تحديث فوري بالواجهة ثم تأكيد من الخادم)
  async function toggleFav(id) {
    if (!token) return;
    // تحديث تفاؤلي فوري
    setCreations((list) => list.map((c) => c.id === id ? { ...c, favorite: !c.favorite } : c));
    try {
      const r = await fetch(API_BASE + "/api/creations/" + id + "/favorite", {
        method: "POST",
        headers: { Authorization: "Bearer " + token },
      });
      const d = await r.json().catch(() => ({}));
      if (r.ok) {
        // مزامنة مع الحالة الفعلية من الخادم
        setCreations((list) => list.map((c) => c.id === id ? { ...c, favorite: !!d.favorite } : c));
      } else {
        // فشل — نرجع الحالة
        setCreations((list) => list.map((c) => c.id === id ? { ...c, favorite: !c.favorite } : c));
      }
    } catch (e) {
      setCreations((list) => list.map((c) => c.id === id ? { ...c, favorite: !c.favorite } : c));
    }
  }

  // نسخ الوصف
  function copyPrompt(id, text) {
    if (!text) return;
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(""), 1500);
  }

  // تحميل الأعمال عند تسجيل الدخول، وتحديثها بعد كل توليد ناجح
  useEffect(() => { if (token) { loadCreations(); checkAdmin(token); } }, [token]);

  // قراءة كود الإحالة من الرابط (?ref=CODE) عند فتح الموقع، ويُحفظ للجلسة
  useEffect(() => {
    try {
      const p = new URLSearchParams(window.location.search);
      const r = p.get("ref");
      if (r) {
        const code = r.trim().toUpperCase().slice(0, 12);
        setRefFromUrl(code);
        sessionStorage.setItem("tayf_ref", code);
      } else {
        const saved = sessionStorage.getItem("tayf_ref");
        if (saved) setRefFromUrl(saved);
      }
    } catch (e) {}
  }, []);

  // جلب رابط الإحالة الخاص بالمستخدم عند تسجيل الدخول
  useEffect(() => {
    if (!token || !user) { setMyRef(null); return; }
    (async () => {
      try {
        const r = await fetch(API_BASE + "/api/referral", { headers: { Authorization: "Bearer " + token } });
        const d = await r.json().catch(() => ({}));
        if (r.ok && d.code) setMyRef(d);
      } catch (e) {}
    })();
  }, [token, user]);

  // الفيديو لا يدعم نسبة 4:5 — نرجعها تلقائياً إلى 9:16 عند التبديل للفيديو
  useEffect(() => { if (mode === "video" && ratio === "4:5") setRatio("9:16"); }, [mode, ratio]);

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

  // ====== الطيف الضوئي التفاعلي في الخلفية ======
  useEffect(() => {
    const canvas = spectrumRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W, H, dpr, raf;
    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);

    const colors = [
      [157, 78, 255], [255, 46, 151], [34, 180, 238], [120, 90, 230], [201, 168, 106],
    ];
    const blobs = [];
    for (let i = 0; i < 5; i++) {
      blobs.push({
        x: Math.random() * W, y: Math.random() * H * 0.7,
        r: Math.min(W, H) * (0.3 + Math.random() * 0.2),
        c: colors[i % colors.length],
        dx: (Math.random() - 0.5) * 0.16, dy: (Math.random() - 0.5) * 0.12,
        ph: Math.random() * Math.PI * 2,
      });
    }
    let mx = W / 2, my = H * 0.35, tmx = mx, tmy = my;
    function onMove(e) { tmx = e.clientX; tmy = e.clientY; }
    function onTouch(e) { if (e.touches && e.touches[0]) { tmx = e.touches[0].clientX; tmy = e.touches[0].clientY; } }
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onTouch, { passive: true });

    if (reduce) {
      // وضع ثابت لمن يفضّل تقليل الحركة: نرسم مرة واحدة
      ctx.globalCompositeOperation = "screen";
      for (const b of blobs) {
        const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
        const [r, gr, bl] = b.c;
        g.addColorStop(0, `rgba(${r},${gr},${bl},0.34)`);
        g.addColorStop(0.5, `rgba(${r},${gr},${bl},0.12)`);
        g.addColorStop(1, `rgba(${r},${gr},${bl},0)`);
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";
      return () => { window.removeEventListener("resize", resize); window.removeEventListener("mousemove", onMove); window.removeEventListener("touchmove", onTouch); };
    }

    function draw() {
      mx += (tmx - mx) * 0.05; my += (tmy - my) * 0.05;
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = "screen";
      for (let i = 0; i < blobs.length; i++) {
        const b = blobs[i];
        b.x += b.dx; b.y += b.dy; b.ph += 0.01;
        const pull = (i === 0 ? 0.04 : 0.012 * (1 + i * 0.3)) * 0.15;
        b.x += (mx - b.x) * pull; b.y += (my - b.y) * pull;
        if (b.x < -b.r * 0.5) b.x = W + b.r * 0.3;
        if (b.x > W + b.r * 0.5) b.x = -b.r * 0.3;
        if (b.y < -b.r * 0.5) b.y = H + b.r * 0.3;
        if (b.y > H + b.r * 0.5) b.y = -b.r * 0.3;
        const rad = b.r * (Math.sin(b.ph) * 0.12 + 1);
        const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, rad);
        const [r, gr, bl] = b.c;
        g.addColorStop(0, `rgba(${r},${gr},${bl},0.40)`);
        g.addColorStop(0.5, `rgba(${r},${gr},${bl},0.13)`);
        g.addColorStop(1, `rgba(${r},${gr},${bl},0)`);
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(b.x, b.y, rad, 0, Math.PI * 2); ctx.fill();
      }
      const mg = ctx.createRadialGradient(mx, my, 0, mx, my, 170);
      mg.addColorStop(0, "rgba(255,255,255,0.08)");
      mg.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = mg;
      ctx.beginPath(); ctx.arc(mx, my, 170, 0, Math.PI * 2); ctx.fill();
      ctx.globalCompositeOperation = "source-over";
      raf = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onTouch);
    };
  }, [reduce]);

  async function enhance() {
    if (!prompt.trim() || enhancing) return;
    setEnhancing(true); setEnhanceErr(""); setEnhanced("");
    const styleEn = STYLE_IDS.find((s) => s.id === style)?.en || "";
    try {
      const res = await fetch(API_BASE + "/api/enhance", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
        body: JSON.stringify({ prompt: prompt.trim(), mode, styleEn }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.enhanced) setEnhanced(data.enhanced);
      else if (data.error === "CONTENT_BLOCKED") setEnhanceErr(a.blocked);
      else if (data.error === "TOO_MANY_REQUESTS" || data.error === "TOO_MANY_ATTEMPTS") setEnhanceErr(a.manyReq);
      else if (res.status === 401) { setEnhanceErr(a.sessEnd); logout(); }
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
  const countMax = 1;
  const effCount = 1; // ناتج واحد دائماً (أُزيل خيار عدد النتائج)
  const perVideoUnit = Math.max(1, effCount * modelMult);
  // مدة الفيديو إجبارية: 5 أو 10 ثوانٍ فقط (متطلّب Kling 2.6)
  // نحسب أقصى مدة متاحة حسب الرصيد، ثم نسمح فقط بالقيم 5 و 10
  const vMaxRaw = Math.floor(freeLeft / perVideoUnit);
  const allowed = [5, 10].filter((d) => d <= vMaxRaw); // القيم المتاحة فعلياً
  // إن لم تكفِ حتى للـ5، نُبقي 5 كحد أدنى (سيمنع الزر الرصيدُ الناقصُ التوليدَ)
  const durOptions = allowed.length ? allowed : [5];
  // نضبط المدة المختارة لتكون ضمن المتاح
  const dDur = durOptions.includes(duration) ? duration : durOptions[0];
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
          promptRaw: prompt.trim(),
          promptEn: enhanced || "",
          ratio,
          duration: dDur,
          count: effCount,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (data.error === "INSUFFICIENT_CREDITS") { setNoCredit(true); }
        else if (data.error === "CONTENT_BLOCKED") { setGenErr(a.blocked); }
        else if (data.error === "TOO_MANY_REQUESTS" || data.error === "TOO_MANY_ATTEMPTS") { setGenErr(a.manyReq); }
        else if (res.status === 401) { setGenErr(t.errConn || "انتهت الجلسة، سجّل الدخول من جديد."); logout(); }
        else { setGenErr(t.errGen || "تعذّر التوليد. حاول مرة أخرى."); }
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
      // تحديث الأرشيف بعد التوليد الناجح
      if (data.saved && data.saved.length) {
        setCreations((list) => [...data.saved, ...list]);
      } else {
        loadCreations();
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

      <canvas ref={spectrumRef} className="spectrum-canvas" aria-hidden="true" />

      <header className="topbar">
        <div className="brand">
          <span className="mark" aria-hidden="true" />
          <span className="brandname">{t.brand}</span>
        </div>
        <nav className="nav">
          <a href="#studio">{t.nav[0]}</a>
          {user && <a href="#mywork">{ar.title}</a>}
          <a href="#gallery">{t.nav[1]}</a>
          <a href="#features">{t.nav[2]}</a>
        </nav>
        <button className="menu-btn" aria-label="القائمة" aria-expanded={mobileNavOpen} onClick={() => setMobileNavOpen((v) => !v)}>
          <span /><span /><span />
        </button>
        {mobileNavOpen && (
          <div className="mobile-nav" onClick={() => setMobileNavOpen(false)}>
            <a href="#studio">{t.nav[0]}</a>
            {user && <a href="#mywork">{ar.title}</a>}
            <a href="#gallery">{t.nav[1]}</a>
            <a href="#features">{t.nav[2]}</a>
          </div>
        )}

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
            {isAdmin && <button className="ghost-btn small admin-open-btn" onClick={openAdmin}>لوحة التحكم</button>}
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
            <button className={"mode " + (mode === "video" ? "on" : "") + (isFree ? " locked-mode" : "")}
              onClick={() => { if (isFree) { openPlans(); } else { setMode("video"); } }}>
              <IconVideo /> {t.video}
              {isFree && <span className="lock-badge"><svg className="ei" viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><rect x="4.5" y="10.5" width="15" height="10" rx="2.3"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/></svg> {t.locked}</span>}
            </button>
          </div>

          <div className="prompt-box">
            <textarea ref={taRef} value={prompt} onChange={(e) => setPrompt(e.target.value)}
              placeholder={mode === "video" ? t.phVid : t.phImg} rows={3} />
            <div className="prompt-actions">
              <button className="enhance" onClick={enhance} disabled={enhancing || !prompt.trim()}>
                <IconSpark />{enhancing ? t.enhancing : t.enhance}
              </button>
              <button className="tpl-btn" onClick={() => setTemplatesOpen(true)} type="button">
                <IconGrid /> {L_TEMPLATES[lang] || L_TEMPLATES.ar}
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
                          ? <span className="model-lock"><svg className="ei" viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><rect x="4.5" y="10.5" width="15" height="10" rx="2.3"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/></svg> {t.locked}</span>
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
              <div className="dur-options">
                {[5, 10].map((d) => {
                  const enabled = durOptions.includes(d);
                  return (
                    <button
                      key={d}
                      type="button"
                      className={"dur-btn" + (dDur === d ? " active" : "") + (enabled ? "" : " disabled")}
                      disabled={!enabled}
                      onClick={() => enabled && setDuration(d)}
                    >
                      {d} {t.sec}
                    </button>
                  );
                })}
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

          <div className="control-group">
            <label className="ctl-label">{t.ratioLabel}</label>
            <div className="chips">
              {RATIO_IDS.filter((r) => !(mode === "video" && r.id === "4:5")).map((r) => (
                <button key={r.id} className={"chip " + (ratio === r.id ? "on" : "")}
                  onClick={() => setRatio(r.id)}>{t.ratios[r.k]} {r.id}</button>
              ))}
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
                              style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "inherit", cursor: "pointer" }} />
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

        {/* قسم الإحالة: ادعُ أصدقاءك */}
        {user && myRef && myRef.code && (
          <section className="referral">
            <div className="ref-card">
              <div className="ref-icon"><svg className="ei" viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12v8.5H4V12"/><rect x="2.6" y="7.8" width="18.8" height="4.2" rx="1"/><path d="M12 7.8v12.7"/><path d="M12 7.8C11 5 9.6 4 8 4a2 2 0 1 0 0 4Z"/><path d="M12 7.8C13 5 14.4 4 16 4a2 2 0 1 1 0 4Z"/></svg></div>
              <h2 className="ref-title">{L_REF_TITLE[lang] || L_REF_TITLE.ar}</h2>
              <p className="ref-desc">{L_REF_DESC[lang] || L_REF_DESC.ar}</p>
              {myRef.bonus ? (
                <div className="ref-bonus-tag">+{myRef.bonus} {L_REF_BONUS_TAG[lang] || L_REF_BONUS_TAG.ar}</div>
              ) : null}
              <div className="ref-link-row">
                <input className="ref-link-input" value={refLink()} readOnly onFocus={(e) => e.target.select()} />
                <button className="ref-copy-btn" onClick={copyRefLink}>
                  {refCopied ? <IconSpark /> : <IconCopy />}
                  <span>{refCopied ? (L_COPIED[lang] || L_COPIED.ar) : (L_COPY_LINK[lang] || L_COPY_LINK.ar)}</span>
                </button>
              </div>
              <div className="ref-share-row">
                <a className="ref-share wa" href={"https://wa.me/?text=" + encodeURIComponent((L_REF_INVITE_MSG[lang] || L_REF_INVITE_MSG.ar) + " " + refLink())} target="_blank" rel="noopener noreferrer">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.38c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.44-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.57-.49-.5-.67-.5h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.22 3.08.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35M12 2a10 10 0 0 0-8.6 15.06L2 22l5.05-1.32A10 10 0 1 0 12 2"/></svg>
                  <span>واتساب</span>
                </a>
                <a className="ref-share tg" href={"https://t.me/share/url?url=" + encodeURIComponent(refLink()) + "&text=" + encodeURIComponent(L_REF_INVITE_MSG[lang] || L_REF_INVITE_MSG.ar)} target="_blank" rel="noopener noreferrer">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M21.9 4.3 18.6 19.6c-.25 1.1-.9 1.37-1.83.85l-5.06-3.73-2.44 2.35c-.27.27-.5.5-1.02.5l.36-5.16L16.86 6.4c.41-.36-.09-.56-.63-.2L6.4 12.6 1.4 11c-1.08-.34-1.1-1.08.23-1.6l19.3-7.44c.9-.33 1.69.2 1.4 1.55"/></svg>
                  <span>تيليجرام</span>
                </a>
              </div>
              {myRef.count > 0 && (
                <div className="ref-count">
                  <b>{myRef.count}</b> {L_REF_COUNT[lang] || L_REF_COUNT.ar}
                </div>
              )}
            </div>
          </section>
        )}

        {/* قسم الأرشيف: أعمالي */}
        {user && (
          <section id="mywork" className="mywork">
            <div className="mywork-head">
              <h2>{ar.title}</h2>
              <div className="mywork-head-actions">
                {creations.some((c) => c.favorite) && (
                  <div className="fav-filter">
                    <button className={"fav-tab " + (!favOnly ? "on" : "")} onClick={() => setFavOnly(false)}>
                      {L_ALL[lang] || L_ALL.ar}
                    </button>
                    <button className={"fav-tab " + (favOnly ? "on" : "")} onClick={() => setFavOnly(true)}>
                      <svg className="ei" viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor"><path d="M12 3.6l2.6 5.4 5.9.6-4.4 4 1.2 5.8L12 16.9 6.7 19.4 8 13.6 3.5 9.6l5.9-.6Z"/></svg> {L_FAVS[lang] || L_FAVS.ar}
                    </button>
                  </div>
                )}
                <button className="ghost-btn small" onClick={loadCreations} disabled={archLoading}>
                  {archLoading ? ar.loading : ar.refresh}
                </button>
              </div>
            </div>
            {creations.length === 0 ? (
              <div className="empty">{archLoading ? ar.loading : ar.empty}</div>
            ) : (favOnly && !creations.some((c) => c.favorite)) ? (
              <div className="empty">{L_NO_FAVS[lang] || L_NO_FAVS.ar}</div>
            ) : (
              <div className="mywork-grid">
                {creations.filter((c) => !favOnly || c.favorite).map((c) => (
                  <div key={c.id} className="mw-card">
                    <div className="mw-media"
                      onClick={() => setLightbox({ url: c.url, mode: c.mode })}>
                      {c.mode === "video" ? (
                        <video src={c.url} playsInline muted />
                      ) : (
                        <img src={c.url} alt={c.prompt || "creation"} />
                      )}
                      {c.favorite && <span className="mw-fav-flag" aria-hidden="true"><svg className="ei" viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor"><path d="M12 3.6l2.6 5.4 5.9.6-4.4 4 1.2 5.8L12 16.9 6.7 19.4 8 13.6 3.5 9.6l5.9-.6Z"/></svg></span>}
                      <div className="mw-actions">
                        <button className={"card-act mw-fav" + (c.favorite ? " on" : "")}
                          title={c.favorite ? (L_FAV_REMOVE[lang] || L_FAV_REMOVE.ar) : (L_FAV_ADD[lang] || L_FAV_ADD.ar)}
                          onClick={(e) => { e.stopPropagation(); toggleFav(c.id); }}>
                          {c.favorite ? (<svg className="ei" viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor"><path d="M12 3.6l2.6 5.4 5.9.6-4.4 4 1.2 5.8L12 16.9 6.7 19.4 8 13.6 3.5 9.6l5.9-.6Z"/></svg>) : (<svg className="ei" viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"><path d="M12 3.6l2.6 5.4 5.9.6-4.4 4 1.2 5.8L12 16.9 6.7 19.4 8 13.6 3.5 9.6l5.9-.6Z"/></svg>)}
                        </button>
                        <button className="card-act" title={L_VIEW[lang] || L_VIEW.ar}
                          onClick={(e) => { e.stopPropagation(); setLightbox({ url: c.url, mode: c.mode }); }}>
                          <IconExpand />
                        </button>
                        <button className="card-act" title={L_SHARE[lang] || L_SHARE.ar}
                          onClick={(e) => { e.stopPropagation(); setShareUrl(c.url); }}>
                          <IconShare />
                        </button>
                        {c.mode !== "video" && (
                          <button className="card-act" title={L_EDIT[lang] || L_EDIT.ar}
                            onClick={(e) => { e.stopPropagation(); setEditorSrc(c.url); }}>
                            <IconEdit />
                          </button>
                        )}
                        <button className="card-act" title={L_SAVE[lang] || L_SAVE.ar}
                          onClick={(e) => { e.stopPropagation(); downloadOutput(c.url); }}>
                          <IconDownload />
                        </button>
                        <button className="card-act mw-del" title={ar.del}
                          onClick={(e) => { e.stopPropagation(); removeCreation(c.id); }}>
                          <IconTrash />
                        </button>
                      </div>
                    </div>
                    {c.prompt && (
                      <div className="mw-info">
                        <p className="mw-prompt" title={c.prompt}>{c.prompt}</p>
                        <button className="mw-copy"
                          onClick={() => copyPrompt(c.id, c.promptEn || c.prompt)}>
                          {copiedId === c.id ? ar.copied : ar.copyPrompt}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

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
          <div className="footer-top">
            <a className="footer-brand" href="https://tayf.art" aria-label={t.brand}>
              <svg className="footer-logo" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <defs><linearGradient id="footGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#9D4EFF"/><stop offset="0.5" stopColor="#FF2E97"/><stop offset="1" stopColor="#22B4EE"/>
                </linearGradient></defs>
                <rect width="64" height="64" rx="15" fill="url(#footGrad)"/>
                <text x="30" y="46" fontFamily="Arial, sans-serif" fontSize="42" fontWeight="900" fill="#fff" textAnchor="middle">T</text>
                <text x="49" y="20" fontFamily="Arial, sans-serif" fontSize="13" fontWeight="800" fill="#fff" textAnchor="middle" opacity="0.95">AI</text>
              </svg>
              <span className="brandname small">{t.brand}</span>
            </a>
            <nav className="footer-links">
              <a href="/terms.html">{F_TERMS[lang] || F_TERMS.ar}</a>
              <a href="/privacy.html">{F_PRIVACY[lang] || F_PRIVACY.ar}</a>
              <a href="/faq.html">{F_FAQ[lang] || F_FAQ.ar}</a>
              <button type="button" className="footer-link-btn" onClick={() => setContactOpen(true)}>
                {F_CONTACT[lang] || F_CONTACT.ar}
              </button>
            </nav>
          </div>

          <div className="footer-social">
            <a className="wa" href="https://wa.me/9647775165945" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" title="WhatsApp">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.5 14.38c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.44-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.57-.49-.5-.67-.5h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.22 3.08.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35M12 2a10 10 0 0 0-8.6 15.06L2 22l5.05-1.32A10 10 0 1 0 12 2"/></svg>
            </a>
            <a className="fb" href="https://www.facebook.com/mu7mmdd" target="_blank" rel="noopener noreferrer" aria-label="Facebook" title="Facebook">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22 12a10 10 0 1 0-11.56 9.87v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.88h-2.34v6.99A10 10 0 0 0 22 12"/></svg>
            </a>
            <a className="ig" href="https://instagram.com/majhsmk" target="_blank" rel="noopener noreferrer" aria-label="Instagram" title="Instagram">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><rect x="2.5" y="2.5" width="19" height="19" rx="5.5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none"/></svg>
            </a>
            <a className="em" href="https://mail.google.com/mail/?view=cm&fs=1&to=tayff.art@gmail.com" target="_blank" rel="noopener noreferrer" aria-label="Email" title="tayff.art@gmail.com">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m3.5 7.5 8.5 5.5 8.5-5.5"/></svg>
            </a>
          </div>

          <p className="footer-tag">{t.footer}</p>
          <p className="footer-copy">© 2026 {t.brand} — {F_RIGHTS[lang] || F_RIGHTS.ar}</p>
        </footer>
      </main>

      {/* نافذة الحساب */}
      {authOpen && (
        <div className="modal-overlay" onClick={() => setAuthOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setAuthOpen(false)} aria-label={a.close}>×</button>
            {authMode === "signup" && <span className="modal-trial"><IconSpark /> {a.trial}</span>}
            <h2 className="modal-title">{
              authMode === "signup" ? a.su :
              authMode === "forgot" ? a.fpTitle :
              authMode === "reset" ? a.rsTitle : a.li
            }</h2>
            <p className="modal-sub">{
              authMode === "signup" ? a.suSub :
              authMode === "forgot" ? a.fpSub :
              authMode === "reset" ? a.rsSub : a.liSub
            }</p>

            <div className="fields">
              {authMode === "signup" && (
                <input className="field" placeholder={a.name} value={fName}
                  onChange={(e) => setFName(e.target.value)} />
              )}
              {/* البريد: يظهر في كل الأوضاع عدا إعادة التعيين (البريد مُدخل مسبقاً) */}
              {authMode !== "reset" && (
                <input className="field" type="email" placeholder={a.email} value={fEmail}
                  onChange={(e) => setFEmail(e.target.value)} dir="ltr"
                  onKeyDown={(e) => e.key === "Enter" && (authMode === "forgot" ? forgotPassword() : submitAuth())} />
              )}
              {/* الرمز: في وضع إعادة التعيين فقط */}
              {authMode === "reset" && (
                <input className="field" type="text" inputMode="numeric" maxLength={6}
                  placeholder={a.codePh} value={fCode}
                  onChange={(e) => setFCode(e.target.value.replace(/[^0-9]/g, ""))} dir="ltr"
                  style={{ textAlign: "center", letterSpacing: "4px", fontSize: "18px" }} />
              )}
              {/* كلمة المرور: في الدخول/التسجيل/إعادة التعيين (مو في نسيت) */}
              {authMode !== "forgot" && (
                <input className="field" type="password"
                  placeholder={authMode === "reset" ? a.newPassPh : a.pass} value={fPass}
                  onChange={(e) => setFPass(e.target.value)} dir="ltr"
                  onKeyDown={(e) => e.key === "Enter" && (authMode === "reset" ? resetPassword() : submitAuth())} />
              )}
            </div>

            {authErr && <div className="err">{authErr}</div>}
            {authNote && <div className="cost-hint" style={{ marginTop: 10 }}><IconSpark /> {authNote}</div>}

            <button className="modal-submit"
              onClick={authMode === "forgot" ? forgotPassword : authMode === "reset" ? resetPassword : submitAuth}
              disabled={authBusy}
              style={authBusy ? { opacity: 0.75, cursor: "wait" } : null}>
              {authBusy ? "…" : (
                authMode === "signup" ? a.doSu :
                authMode === "forgot" ? a.fpSend :
                authMode === "reset" ? a.rsDo : a.doLi
              )}
            </button>

            {/* رابط نسيت كلمة السر — في وضع الدخول فقط */}
            {authMode === "login" && (
              <button className="modal-toggle"
                onClick={() => { setAuthMode("forgot"); setAuthErr(""); setAuthNote(""); setFPass(""); }}>
                {a.fpLink}
              </button>
            )}

            {/* رجوع لتسجيل الدخول — في وضعي نسيت/إعادة التعيين */}
            {(authMode === "forgot" || authMode === "reset") && (
              <button className="modal-toggle"
                onClick={() => { setAuthMode("login"); setAuthErr(""); setAuthNote(""); setFCode(""); }}>
                {a.backLogin}
              </button>
            )}

            {/* التبديل بين تسجيل/دخول — في وضعي التسجيل والدخول فقط */}
            {(authMode === "signup" || authMode === "login") && (
              <button className="modal-toggle"
                onClick={() => { setAuthMode(authMode === "signup" ? "login" : "signup"); setAuthErr(""); setAuthNote(""); }}>
                {authMode === "signup" ? a.have : a.no}
              </button>
            )}

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

      {/* محرّر الصور */}
      {editorSrc && (
        <ImageEditor src={editorSrc} proxyBase={API_BASE + "/api/download?url="} fileName="tayf-edited" onClose={() => setEditorSrc(null)} />
      )}

      {/* نافذة المشاركة */}
      {shareUrl && (
        <div className="modal-overlay" onClick={() => { setShareUrl(null); setShareCopied(false); }}>
          <div className="modal share-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => { setShareUrl(null); setShareCopied(false); }} aria-label={a.close}>×</button>
            <h2 className="modal-title">{L_SHARE_VIA[lang] || L_SHARE_VIA.ar}</h2>
            <div className="share-grid">
              <a className="share-opt share-wa" href={"https://wa.me/?text=" + encodeURIComponent("شاهد هذا العمل من طيف ✨ " + shareUrl)} target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.38c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.44-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.57-.49-.5-.67-.5h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.22 3.08.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35M12 2a10 10 0 0 0-8.6 15.06L2 22l5.05-1.32A10 10 0 1 0 12 2"/></svg>
                <span>واتساب</span>
              </a>
              <a className="share-opt share-tg" href={"https://t.me/share/url?url=" + encodeURIComponent(shareUrl) + "&text=" + encodeURIComponent("شاهد هذا العمل من طيف ✨")} target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M21.9 4.3 18.6 19.6c-.25 1.1-.9 1.37-1.83.85l-5.06-3.73-2.44 2.35c-.27.27-.5.5-1.02.5l.36-5.16L16.86 6.4c.41-.36-.09-.56-.63-.2L6.4 12.6 1.4 11c-1.08-.34-1.1-1.08.23-1.6l19.3-7.44c.9-.33 1.69.2 1.4 1.55"/></svg>
                <span>تيليجرام</span>
              </a>
              <a className="share-opt share-fb" href={"https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(shareUrl)} target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 1 0-11.56 9.87v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.88h-2.34v6.99A10 10 0 0 0 22 12"/></svg>
                <span>فيسبوك</span>
              </a>
              <button className="share-opt share-copy" onClick={() => copyShareLink(shareUrl)}>
                {shareCopied ? <IconSpark /> : <IconCopy />}
                <span>{shareCopied ? (L_COPIED[lang] || L_COPIED.ar) : (L_COPY_LINK[lang] || L_COPY_LINK.ar)}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* نافذة القوالب الجاهزة */}
      {templatesOpen && (
        <div className="modal-overlay" onClick={() => setTemplatesOpen(false)}>
          <div className="modal tpl-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setTemplatesOpen(false)} aria-label={a.close}>×</button>
            <h2 className="modal-title">{L_TPL_TITLE[lang] || L_TPL_TITLE.ar}</h2>
            <div className="tpl-cats">
              {TPL_CATS.map((c) => (
                <button key={c.id} className={"tpl-cat " + (tplCat === c.id ? "on" : "")} onClick={() => setTplCat(c.id)}>
                  <span className="tpl-cat-ic">{c.id==="portrait"?(<svg className="ei" viewBox="0 0 24 24" width="1.1em" height="1.1em" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8.5" r="3.5"/><path d="M5.5 20a6.5 6.5 0 0 1 13 0"/></svg>):c.id==="business"?(<svg className="ei" viewBox="0 0 24 24" width="1.1em" height="1.1em" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="3.5" width="14" height="17" rx="1.5"/><path d="M9 8h2M13 8h2M9 12h2M13 12h2M10 16.5h4"/></svg>):c.id==="art"?(<svg className="ei" viewBox="0 0 24 24" width="1.1em" height="1.1em" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"><path d="M12 3.5a8.5 8.5 0 1 0 0 17c1.3 0 1.9-1 1.9-1.9 0-1.2-1-1.4-1-2.4 0-.8.6-1.4 1.5-1.4h1.8A3.3 3.3 0 0 0 21 11.4C21 7 17 3.5 12 3.5Z"/><circle cx="7.6" cy="11" r="1.1"/><circle cx="9.6" cy="7.6" r="1.1"/><circle cx="14.5" cy="7.6" r="1.1"/></svg>):(<svg className="ei" viewBox="0 0 24 24" width="1.1em" height="1.1em" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="8.5" r="2.6"/><path d="M3.5 20h17M5.5 20l3.5-4.5 3 3.5 2.2-2.8L20 20"/></svg>)}</span>{c.label[lang] || c.label.ar}
                </button>
              ))}
            </div>
            <div className="tpl-grid">
              {TEMPLATES.filter((tp) => tp.cat === tplCat).map((tp, i) => (
                <button key={i} className="tpl-card" onClick={() => applyTemplate(tp)}>
                  <span className="tpl-card-title">{lang === "ar" ? tp.titleAr : tp.titleEn}</span>
                  <span className="tpl-card-desc">{lang === "ar" ? tp.promptAr : tp.promptEn}</span>
                </button>
              ))}
            </div>
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

      {/* ===== لوحة الأدمن ===== */}
      {adminOpen && (
        <div className="modal-overlay" onClick={() => setAdminOpen(false)}>
          <div className="modal admin-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setAdminOpen(false)} aria-label="إغلاق">×</button>
            <h2 className="modal-title">لوحة التحكم</h2>
            <p className="modal-sub">إدارة المستخدمين والأرصدة والاشتراكات.</p>

            {adminLoading ? (
              <div className="admin-loading">جاري تحميل البيانات…</div>
            ) : (
              <>
                {/* بطاقات الإحصائيات */}
                {adminStats && (
                  <div className="admin-stats">
                    <div className="admin-stat"><span className="admin-stat-num">{adminStats.totalUsers ?? 0}</span><span className="admin-stat-lbl">المستخدمون</span></div>
                    <div className="admin-stat"><span className="admin-stat-num">{adminStats.verifiedUsers ?? 0}</span><span className="admin-stat-lbl">مُفعّلون</span></div>
                    <div className="admin-stat"><span className="admin-stat-num">{adminStats.subscribedUsers ?? 0}</span><span className="admin-stat-lbl">مشتركون</span></div>
                    <div className="admin-stat"><span className="admin-stat-num">{adminStats.totalCreations ?? 0}</span><span className="admin-stat-lbl">الأعمال</span></div>
                    <div className="admin-stat"><span className="admin-stat-num">{adminStats.totalImages ?? 0}</span><span className="admin-stat-lbl">صور</span></div>
                    <div className="admin-stat"><span className="admin-stat-num">{adminStats.totalVideos ?? 0}</span><span className="admin-stat-lbl">فيديو</span></div>
                    <div className="admin-stat"><span className="admin-stat-num">{adminStats.totalCredits ?? 0}</span><span className="admin-stat-lbl">مجموع الرصيد</span></div>
                  </div>
                )}

                <div className="admin-toolbar">
                  <span className="admin-count">{(() => {
                    const q = adminSearch.trim().toLowerCase();
                    const shown = q ? adminUsers.filter((u) => ((u.name || "") + " " + (u.email || "")).toLowerCase().includes(q)).length : adminUsers.length;
                    return q ? `${shown} من ${adminUsers.length} مستخدم` : `${adminUsers.length} مستخدم`;
                  })()}</span>
                  <button className="ghost-btn small" onClick={adminReload} disabled={!!adminBusy}>تحديث</button>
                </div>

                {/* بحث عن مستخدم بالاسم أو الإيميل */}
                <div className="admin-search-wrap">
                  <input
                    className="admin-search"
                    type="text"
                    placeholder="ابحث بالاسم أو الإيميل…"
                    value={adminSearch}
                    onChange={(e) => setAdminSearch(e.target.value)}
                  />
                  {adminSearch && (
                    <button className="admin-search-clear" onClick={() => setAdminSearch("")} aria-label="مسح البحث" title="مسح">×</button>
                  )}
                </div>

                {adminErr && <div className="err" style={{ marginTop: 10 }}>{adminErr}</div>}

                {/* قائمة المستخدمين */}
                <div className="admin-users">
                  {adminUsers
                    .filter((u) => {
                      const q = adminSearch.trim().toLowerCase();
                      if (!q) return true;
                      return ((u.name || "") + " " + (u.email || "")).toLowerCase().includes(q);
                    })
                    .map((u) => {
                    const self = (u.email || "").toLowerCase() === (user?.email || "").toLowerCase();
                    const busy = adminBusy === u.email;
                    return (
                      <div className={"admin-user" + (busy ? " busy" : "")} key={u.email}>
                        <div className="admin-user-main">
                          <div className="admin-user-id">
                            <span className="admin-user-name">{u.name || "—"}</span>
                            <span className="admin-user-email" dir="ltr">{u.email}</span>
                          </div>
                          <div className="admin-badges">
                            {self && <span className="admin-badge admin-badge-gold">أدمن</span>}
                            {u.verified ? <span className="admin-badge admin-badge-ok">مُفعّل</span> : <span className="admin-badge admin-badge-mut">غير مُفعّل</span>}
                            {u.subscribed && <span className="admin-badge admin-badge-sub">مشترك</span>}
                          </div>
                        </div>
                        <div className="admin-user-meta">
                          <span className="admin-credits"><IconSpark /> {u.credits ?? 0} رصيد</span>
                          <span className="admin-meta-dot">•</span>
                          <span>{u.creationsCount ?? 0} عمل</span>
                          <span className="admin-meta-dot">•</span>
                          <span dir="ltr">{u.createdAt ? new Date(u.createdAt).toISOString().slice(0, 10) : "—"}</span>
                        </div>
                        <div className="admin-actions">
                          <button className="admin-btn" onClick={() => adminAddCredits(u.email, 5)} disabled={busy}>+5</button>
                          <button className="admin-btn" onClick={() => adminAddCredits(u.email, -5)} disabled={busy}>−5</button>
                          <button className="admin-btn" onClick={() => adminSetCredits(u.email)} disabled={busy}>تعيين الرصيد</button>
                          <button className="admin-btn" onClick={() => adminToggleSub(u.email, u.subscribed)} disabled={busy}>{u.subscribed ? "إلغاء الاشتراك" : "تفعيل الاشتراك"}</button>
                          <button className="admin-btn admin-btn-danger" onClick={() => adminRemoveUser(u.email)} disabled={busy || self} title={self ? "لا يمكن حذف حساب الأدمن" : "حذف نهائي"}>حذف</button>
                        </div>
                      </div>
                    );
                  })}
                  {adminUsers.length === 0 && <div className="admin-empty">لا يوجد مستخدمون بعد.</div>}
                  {adminUsers.length > 0 && adminSearch.trim() && adminUsers.filter((u) => ((u.name || "") + " " + (u.email || "")).toLowerCase().includes(adminSearch.trim().toLowerCase())).length === 0 && (
                    <div className="admin-empty">لا يوجد مستخدم يطابق «{adminSearch}».</div>
                  )}
                </div>
              </>
            )}
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
const IconTrash = () => (<svg viewBox="0 0 24 24" {...s}><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>);
const IconEdit = () => (<svg viewBox="0 0 24 24" {...s}><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>);
const IconShare = () => (<svg viewBox="0 0 24 24" {...s}><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"/></svg>);
const IconGrid = () => (<svg viewBox="0 0 24 24" {...s}><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>);
const IconCopy = () => (<svg viewBox="0 0 24 24" {...s}><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>);


// ============ ثوابت المحرّر ============
const ADJ_DEFS = [
  { key: "brightness", label: "السطوع", min: 50, max: 150, def: 100, unit: "%" },
  { key: "contrast", label: "التباين", min: 50, max: 150, def: 100, unit: "%" },
  { key: "saturate", label: "التشبّع", min: 0, max: 200, def: 100, unit: "%" },
  { key: "temp", label: "حرارة اللون", min: -100, max: 100, def: 0, unit: "" },
  { key: "sharpen", label: "الحِدّة", min: 0, max: 100, def: 0, unit: "%" },
  { key: "blur", label: "الضبابية", min: 0, max: 20, def: 0, unit: "px" },
  { key: "hue", label: "تدوير الألوان", min: 0, max: 360, def: 0, unit: "°" },
  { key: "grayscale", label: "أبيض وأسود", min: 0, max: 100, def: 0, unit: "%" },
  { key: "sepia", label: "سيبيا (بُني)", min: 0, max: 100, def: 0, unit: "%" },
  { key: "invert", label: "عكس الألوان", min: 0, max: 100, def: 0, unit: "%" },
];
const PRESETS = {
  "بلا فلتر": {},
  "عتيق": { sepia: 40, contrast: 110, saturate: 85, brightness: 105 },
  "سينمائي": { contrast: 120, saturate: 90, temp: -15, brightness: 96 },
  "أبيض وأسود": { grayscale: 100, contrast: 115 },
  "دافئ": { temp: 45, saturate: 110, brightness: 104 },
  "بارد": { temp: -45, saturate: 105 },
  "زاهي": { saturate: 160, contrast: 112, brightness: 103 },
  "ناعم": { blur: 1, brightness: 106, saturate: 92, contrast: 94 },
};
const POSITIONS = ["tl", "tc", "tr", "ml", "mc", "mr", "bl", "bc", "br"];
const defAdj = () => { const o = {}; ADJ_DEFS.forEach((d) => (o[d.key] = d.def)); return o; };
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

// أيقونات خطّية بسيطة
const sx = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" };
const TIAdjust = () => (<svg {...sx}><line x1="4" y1="7" x2="20" y2="7" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="17" x2="20" y2="17" /><circle cx="9" cy="7" r="2.2" fill="#131318" /><circle cx="15" cy="12" r="2.2" fill="#131318" /><circle cx="8" cy="17" r="2.2" fill="#131318" /></svg>);
const TIPresets = () => (<svg {...sx}><path d="M12 3l1.9 4.6L19 9.2l-3.7 3.3 1 5L12 15l-4.3 2.5 1-5L5 9.2l5.1-1.6z" /></svg>);
const TICrop = () => (<svg {...sx}><path d="M6 2v14a2 2 0 0 0 2 2h14" /><path d="M2 6h14a2 2 0 0 1 2 2v14" /></svg>);
const TIMark = () => (<svg {...sx}><path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0l-7.2-7.2a2 2 0 0 1-.6-1.4V5a2 2 0 0 1 2-2h6.6a2 2 0 0 1 1.4.6l7.2 7.2a2 2 0 0 1 0 2.8z" /><circle cx="7.5" cy="7.5" r="1.3" fill="currentColor" /></svg>);
const TIText = () => (<svg {...sx}><path d="M5 6V4h14v2" /><line x1="12" y1="4" x2="12" y2="20" /><line x1="9" y1="20" x2="15" y2="20" /></svg>);

const TABS = [
  { id: "adjust", label: "تعديلات", icon: TIAdjust },
  { id: "presets", label: "فلاتر", icon: TIPresets },
  { id: "crop", label: "قص", icon: TICrop },
  { id: "mark", label: "علامة", icon: TIMark },
  { id: "text", label: "نص", icon: TIText },
];


// ============ مكوّن محرّر الصور ============
function ImageEditor({ src, proxyBase = null, fileName = "tayf-edited", onClose }) {
  const [tab, setTab] = useState("adjust");
  const [adj, setAdj] = useState(defAdj);
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [preset, setPreset] = useState("بلا فلتر");
  const [wm, setWm] = useState({ on: false, text: "طيف", color: "#ffffff", size: 5, opacity: 70, pos: "br" });
  const [txt, setTxt] = useState({ text: "", color: "#ffffff", size: 8, shadow: true, pos: "mc", x: 0.5, y: 0.5 });
  const [cropRatio, setCropRatio] = useState("free");
  const [loaded, setLoaded] = useState(false);
  const [loadErr, setLoadErr] = useState(false);
  const [busy, setBusy] = useState(false);

  const viewRef = useRef(null);
  const overlayRef = useRef(null);
  const imgRef = useRef(null);
  const natRef = useRef({ w: 0, h: 0 });
  const cropRef = useRef({ x: 0.08, y: 0.08, w: 0.84, h: 0.84 });
  const dragRef = useRef(null);
  const comparingRef = useRef(false);

  // ---- تحميل الصورة (عبر الخادم لتفادي CORS، مع بديل مباشر) ----
  useEffect(() => {
    let cancelled = false;
    let objUrl = null;
    setLoaded(false); setLoadErr(false);

    const loadDirect = () => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        if (cancelled) return;
        imgRef.current = img;
        natRef.current = { w: img.naturalWidth, h: img.naturalHeight };
        setLoaded(true);
      };
      img.onerror = () => { if (!cancelled) setLoadErr(true); };
      img.src = src;
    };

    if (proxyBase) {
      // نجيب الصورة عبر الخادم كـ blob (نفس الأصل = بلا تلويث = التنزيل يشتغل)
      fetch(proxyBase + encodeURIComponent(src))
        .then((r) => { if (!r.ok) throw new Error("proxy"); return r.blob(); })
        .then((blob) => {
          if (cancelled) return;
          objUrl = URL.createObjectURL(blob);
          const img = new Image();
          img.onload = () => {
            if (cancelled) return;
            imgRef.current = img;
            natRef.current = { w: img.naturalWidth, h: img.naturalHeight };
            setLoaded(true);
          };
          img.onerror = () => { if (!cancelled) loadDirect(); };
          img.src = objUrl;
        })
        .catch(() => { if (!cancelled) loadDirect(); });
    } else {
      loadDirect();
    }

    return () => { cancelled = true; if (objUrl) URL.revokeObjectURL(objUrl); };
  }, [src, proxyBase]);

  // ---- سلسلة فلتر CSS ----
  const filterString = (a) => {
    const p = [`brightness(${a.brightness}%)`, `contrast(${a.contrast}%)`, `saturate(${a.saturate}%)`];
    if (a.blur > 0) p.push(`blur(${a.blur}px)`);
    if (a.hue > 0) p.push(`hue-rotate(${a.hue}deg)`);
    if (a.grayscale > 0) p.push(`grayscale(${a.grayscale}%)`);
    if (a.sepia > 0) p.push(`sepia(${a.sepia}%)`);
    if (a.invert > 0) p.push(`invert(${a.invert}%)`);
    return p.join(" ");
  };

  const applyTemperature = (imgData, temp) => {
    const d = imgData.data, r = (temp / 100) * 40;
    for (let i = 0; i < d.length; i += 4) {
      d[i] = clamp(d[i] + r, 0, 255);
      d[i + 2] = clamp(d[i + 2] - r, 0, 255);
    }
  };
  const applySharpen = (imgData, amount) => {
    const w = imgData.width, h = imgData.height, s = imgData.data;
    const out = new Uint8ClampedArray(s), c = 1 + 4 * amount, e = -amount;
    for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) {
      const o = (y * w + x) * 4;
      for (let ch = 0; ch < 3; ch++) {
        const i = o + ch;
        out[i] = clamp(c * s[i] + e * s[i - 4] + e * s[i + 4] + e * s[i - w * 4] + e * s[i + w * 4], 0, 255);
      }
    }
    return new ImageData(out, w, h);
  };

  const gridPos = (pos, W, H, tw, fs, pad) => {
    const col = pos[1], row = pos[0];
    const x = col === "l" ? pad : col === "r" ? (W - tw - pad) : (W - tw) / 2;
    const y = row === "t" ? (pad + fs / 2) : row === "b" ? (H - pad - fs / 2) : H / 2;
    return [x, y];
  };
  const drawWatermark = (ctx, W, H) => {
    if (!wm.on || !wm.text.trim()) return;
    const fs = Math.round(Math.min(W, H) * wm.size / 100);
    ctx.save();
    ctx.globalAlpha = wm.opacity / 100;
    ctx.font = `800 ${fs}px Cairo, sans-serif`;
    ctx.fillStyle = wm.color; ctx.textBaseline = "middle";
    const m = ctx.measureText(wm.text), pad = fs * 0.7;
    const [x, y] = gridPos(wm.pos, W, H, m.width, fs, pad);
    ctx.textAlign = "start";
    ctx.shadowColor = "rgba(0,0,0,.45)"; ctx.shadowBlur = fs * 0.12; ctx.shadowOffsetY = fs * 0.04;
    ctx.fillText(wm.text, x, y);
    ctx.restore();
  };
  const drawText = (ctx, W, H) => {
    if (!txt.text.trim()) return;
    const fs = Math.round(Math.min(W, H) * txt.size / 100);
    ctx.save();
    ctx.font = `800 ${fs}px Cairo, sans-serif`;
    ctx.fillStyle = txt.color; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    if (txt.shadow) { ctx.shadowColor = "rgba(0,0,0,.6)"; ctx.shadowBlur = fs * 0.18; ctx.shadowOffsetY = fs * 0.05; }
    ctx.fillText(txt.text, txt.x * W, txt.y * H);
    ctx.restore();
  };

  // ---- الرسم على canvas الهدف ----
  const renderTo = useCallback((canvas, ctx, overlays) => {
    const img = imgRef.current; if (!img) return;
    const rot = ((rotation % 360) + 360) % 360;
    const swap = (rot === 90 || rot === 270);
    const w = natRef.current.w, h = natRef.current.h;
    canvas.width = swap ? h : w; canvas.height = swap ? w : h;
    ctx.save();
    ctx.filter = filterString(adj);
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(rot * Math.PI / 180);
    ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
    ctx.drawImage(img, -w / 2, -h / 2, w, h);
    ctx.restore();
    ctx.filter = "none";
    if (adj.temp !== 0 || adj.sharpen > 0) {
      let d = ctx.getImageData(0, 0, canvas.width, canvas.height);
      if (adj.temp !== 0) applyTemperature(d, adj.temp);
      if (adj.sharpen > 0) d = applySharpen(d, adj.sharpen / 100);
      ctx.putImageData(d, 0, 0);
    }
    if (overlays) { drawWatermark(ctx, canvas.width, canvas.height); drawText(ctx, canvas.width, canvas.height); }
  }, [adj, rotation, flipH, flipV, wm, txt]);

  // ---- طبقة القص ----
  const drawOverlayUI = useCallback(() => {
    const overlay = overlayRef.current, view = viewRef.current;
    if (!overlay || !view || tab !== "crop" || !imgRef.current) return;
    const octx = overlay.getContext("2d");
    overlay.width = view.clientWidth; overlay.height = view.clientHeight;
    const W = overlay.width, H = overlay.height, cr = cropRef.current;
    octx.clearRect(0, 0, W, H);
    octx.fillStyle = "rgba(10,10,12,.62)"; octx.fillRect(0, 0, W, H);
    const cx = cr.x * W, cy = cr.y * H, cw = cr.w * W, ch = cr.h * H;
    octx.clearRect(cx, cy, cw, ch);
    octx.strokeStyle = "#C9A86A"; octx.lineWidth = 2; octx.strokeRect(cx, cy, cw, ch);
    octx.strokeStyle = "rgba(255,255,255,.35)"; octx.lineWidth = 1;
    for (let i = 1; i < 3; i++) {
      octx.beginPath(); octx.moveTo(cx + cw * i / 3, cy); octx.lineTo(cx + cw * i / 3, cy + ch); octx.stroke();
      octx.beginPath(); octx.moveTo(cx, cy + ch * i / 3); octx.lineTo(cx + cw, cy + ch * i / 3); octx.stroke();
    }
    octx.fillStyle = "#C9A86A"; const hs = 9;
    [[cx, cy], [cx + cw, cy], [cx, cy + ch], [cx + cw, cy + ch]].forEach(([px, py]) => octx.fillRect(px - hs / 2, py - hs / 2, hs, hs));
  }, [tab]);

  // ---- إعادة الرسم عند أي تغيير ----
  useEffect(() => {
    if (!loaded) return;
    const view = viewRef.current; if (!view) return;
    renderTo(view, view.getContext("2d"), true);
    drawOverlayUI();
  }, [loaded, renderTo, drawOverlayUI]);

  // ---- ضبط نسبة القص ----
  const applyCropRatio = useCallback((ratio) => {
    if (ratio === "free") { drawOverlayUI(); return; }
    const r = Number(ratio);
    const rot = ((rotation % 360) + 360) % 360, swap = (rot === 90 || rot === 270);
    const CW = swap ? natRef.current.h : natRef.current.w, CH = swap ? natRef.current.w : natRef.current.h;
    const cr = cropRef.current;
    let w = cr.w, h = (w * CW) / (r * CH);
    if (h > 1) { h = cr.h; w = (h * r * CH) / CW; }
    cr.w = w; cr.h = h; cr.x = clamp((1 - w) / 2, 0, 1 - w); cr.y = clamp((1 - h) / 2, 0, 1 - h);
    drawOverlayUI();
  }, [rotation, drawOverlayUI]);

  useEffect(() => { if (tab === "crop") { cropRef.current = { x: 0.08, y: 0.08, w: 0.84, h: 0.84 }; applyCropRatio(cropRatio); } }, [tab]);

  // ---- تفاعل القص ----
  const overlayPos = (e) => {
    const r = overlayRef.current.getBoundingClientRect();
    return [e.clientX - r.left, e.clientY - r.top];
  };
  const hitHandle = (mx, my) => {
    const W = overlayRef.current.width, H = overlayRef.current.height, cr = cropRef.current;
    const pts = { tl: [cr.x * W, cr.y * H], tr: [(cr.x + cr.w) * W, cr.y * H], bl: [cr.x * W, (cr.y + cr.h) * H], br: [(cr.x + cr.w) * W, (cr.y + cr.h) * H] };
    for (const k in pts) { const [px, py] = pts[k]; if (Math.abs(mx - px) < 16 && Math.abs(my - py) < 16) return k; }
    if (mx > cr.x * W && mx < (cr.x + cr.w) * W && my > cr.y * H && my < (cr.y + cr.h) * H) return "move";
    return null;
  };
  const onOverlayDown = (e) => {
    const [mx, my] = overlayPos(e);
    const handle = hitHandle(mx, my);
    if (!handle) return;
    dragRef.current = { handle, mx, my, crop: { ...cropRef.current } };
    overlayRef.current.setPointerCapture(e.pointerId);
  };
  const onOverlayMove = (e) => {
    const dr = dragRef.current; if (!dr) return;
    const [mx, my] = overlayPos(e);
    const W = overlayRef.current.width, H = overlayRef.current.height;
    const dx = (mx - dr.mx) / W, dy = (my - dr.my) / H, s = dr.crop;
    const nc = { ...s };
    if (dr.handle === "move") { nc.x = clamp(s.x + dx, 0, 1 - s.w); nc.y = clamp(s.y + dy, 0, 1 - s.h); }
    else {
      if (dr.handle.includes("l")) { nc.x = clamp(s.x + dx, 0, s.x + s.w - 0.05); nc.w = s.w - (nc.x - s.x); }
      if (dr.handle.includes("r")) { nc.w = clamp(s.w + dx, 0.05, 1 - s.x); }
      if (dr.handle.includes("t")) { nc.y = clamp(s.y + dy, 0, s.y + s.h - 0.05); nc.h = s.h - (nc.y - s.y); }
      if (dr.handle.includes("b")) { nc.h = clamp(s.h + dy, 0.05, 1 - s.y); }
    }
    cropRef.current = nc; drawOverlayUI();
  };
  const onOverlayUp = () => { dragRef.current = null; };

  const doCrop = () => {
    const img = imgRef.current; if (!img) return;
    const work = document.createElement("canvas");
    renderTo(work, work.getContext("2d"), true);
    const cr = cropRef.current;
    const sxp = Math.round(cr.x * work.width), syp = Math.round(cr.y * work.height);
    const sw = Math.round(cr.w * work.width), sh = Math.round(cr.h * work.height);
    const tmp = document.createElement("canvas"); tmp.width = sw; tmp.height = sh;
    tmp.getContext("2d").drawImage(work, sxp, syp, sw, sh, 0, 0, sw, sh);
    const ni = new Image();
    ni.onload = () => {
      imgRef.current = ni; natRef.current = { w: sw, h: sh };
      setAdj(defAdj()); setRotation(0); setFlipH(false); setFlipV(false); setPreset("بلا فلتر");
      setWm((p) => ({ ...p, on: false })); setTxt((p) => ({ ...p, text: "" }));
      cropRef.current = { x: 0.08, y: 0.08, w: 0.84, h: 0.84 };
      setLoaded(true);
      requestAnimationFrame(() => { const v = viewRef.current; if (v) renderTo(v, v.getContext("2d"), true); });
    };
    ni.src = tmp.toDataURL("image/png");
  };

  // ---- سحب النص ----
  const onViewDown = (e) => {
    if (tab === "text" && txt.text.trim()) {
      const move = (ev) => {
        const r = viewRef.current.getBoundingClientRect();
        setTxt((p) => ({ ...p, x: clamp((ev.clientX - r.left) / r.width, 0, 1), y: clamp((ev.clientY - r.top) / r.height, 0, 1) }));
      };
      const up = () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); };
      window.addEventListener("pointermove", move); window.addEventListener("pointerup", up);
      move(e); return;
    }
    if (tab === "crop") return;
    // مقارنة بالأصل
    comparingRef.current = true;
    const v = viewRef.current, ctx = v.getContext("2d");
    v.width = natRef.current.w; v.height = natRef.current.h;
    ctx.filter = "none"; ctx.clearRect(0, 0, v.width, v.height);
    ctx.drawImage(imgRef.current, 0, 0);
    const up = () => {
      comparingRef.current = false;
      const vv = viewRef.current; if (vv) renderTo(vv, vv.getContext("2d"), true);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointerup", up);
  };

  // ---- تنزيل ----
  const download = () => {
    const work = document.createElement("canvas");
    renderTo(work, work.getContext("2d"), true);
    setBusy(true);
    try {
      work.toBlob((blob) => {
        setBusy(false);
        if (!blob) { alert("تعذّر إنشاء الصورة. قد تكون الصورة من مصدر محمي."); return; }
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.download = fileName + "-" + Date.now() + ".png"; a.href = url; a.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }, "image/png");
    } catch (e) {
      setBusy(false);
      alert("تعذّر تنزيل الصورة (الصورة من مصدر خارجي محمي).");
    }
  };

  const resetAll = () => {
    setAdj(defAdj()); setRotation(0); setFlipH(false); setFlipV(false); setPreset("بلا فلتر");
    setWm((p) => ({ ...p, on: false })); setTxt((p) => ({ ...p, text: "" }));
  };
  const setAdjKey = (k, v) => { setAdj((p) => ({ ...p, [k]: v })); setPreset("بلا فلتر"); };
  const applyPreset = (name) => {
    const base = defAdj(); const p = PRESETS[name];
    Object.keys(p).forEach((k) => (base[k] = p[k]));
    setAdj(base); setPreset(name);
  };
  const fmt = (d, v) => (d.key === "temp" ? (v > 0 ? "+" + v : "" + v) : v + d.unit);
  const RATIOS = [["free", "حر"], ["1", "1:1"], ["1.7778", "16:9"], ["0.5625", "9:16"], ["0.8", "4:5"], ["1.3333", "4:3"]];
  const TXT_COLORS = ["#ffffff", "#0A0A0C", "#FF2E97", "#22B4EE", "#C9A86A"];
  const WM_COLORS = ["#ffffff", "#0A0A0C", "#C9A86A"];

  return (
    <div className="ed-overlay" onClick={onClose}>
      <div className="ed-modal" onClick={(e) => e.stopPropagation()}>
        <div className="ed-topbar">
          <div className="ed-brand"><span className="ed-mark">ط</span><b>محرّر الصور</b></div>
          <div className="ed-top-actions">
            <button className="ed-btn" onClick={resetAll}><svg className="ei" viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12a7 7 0 1 1-2.1-5"/><path d="M17 4.5V9h-4.5"/></svg> إعادة تعيين</button>
            <button className="ed-btn ed-btn-gold" onClick={download} disabled={busy || !loaded}>{busy ? "…" : (<span className="ed-dl"><svg className="ei" viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M12 4v10"/><path d="M8 10.5l4 4 4-4"/><path d="M5 19.5h14"/></svg> تنزيل</span>)}</button>
            <button className="ed-btn ed-close" onClick={onClose} aria-label="إغلاق">×</button>
          </div>
        </div>

        <div className="ed-wrap">
          <div className="ed-stage">
            {loadErr ? (
              <div className="ed-msg">تعذّر تحميل الصورة.</div>
            ) : !loaded ? (
              <div className="ed-msg">جارٍ التحميل…</div>
            ) : (
              <div className="ed-canvas-host">
                <canvas ref={viewRef} className="ed-view" onPointerDown={onViewDown} />
                <canvas ref={overlayRef} className={"ed-overlay-canvas" + (tab === "crop" ? "" : " ed-hidden")}
                  onPointerDown={onOverlayDown} onPointerMove={onOverlayMove} onPointerUp={onOverlayUp} />
              </div>
            )}
            {loaded && tab !== "crop" && tab !== "text" && <div className="ed-tip">اضغط مطوّلاً على الصورة للمقارنة بالأصل</div>}
          </div>

          <div className="ed-panel">
            <div className="ed-tabs">
              {TABS.map((tb) => {
                const Icon = tb.icon;
                return (
                  <button key={tb.id} className={"ed-tab" + (tab === tb.id ? " on" : "")} onClick={() => setTab(tb.id)}>
                    <span className="ed-ti"><Icon /></span>{tb.label}
                  </button>
                );
              })}
            </div>
            <div className="ed-body">
              {tab === "adjust" && (
                <>
                  <div className="ed-gt">الإضاءة واللون</div>
                  {ADJ_DEFS.map((d) => (
                    <div className="ed-slider-row" key={d.key}>
                      <div className="ed-slider-head">
                        <label>{d.label}</label>
                        <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <button className="ed-reset-mini" onClick={() => setAdjKey(d.key, d.def)}>صفر</button>
                          <span className="ed-slider-val">{fmt(d, adj[d.key])}</span>
                        </span>
                      </div>
                      <input type="range" min={d.min} max={d.max} step="1" value={adj[d.key]}
                        onChange={(e) => setAdjKey(d.key, Number(e.target.value))} />
                    </div>
                  ))}
                </>
              )}

              {tab === "presets" && (
                <>
                  <div className="ed-gt">فلاتر بضغطة</div>
                  <div className="ed-preset-grid">
                    {Object.keys(PRESETS).map((name) => (
                      <button key={name} className={"ed-preset" + (preset === name ? " on" : "")} onClick={() => applyPreset(name)}>{name}</button>
                    ))}
                  </div>
                  <div className="ed-hint">الفلتر يضبط الإضاءة والألوان تلقائياً. تكدر تعدّلها بعدها من تبويب «تعديلات».</div>
                </>
              )}

              {tab === "crop" && (
                <>
                  <div className="ed-gt">تدوير وقلب</div>
                  <div className="ed-btn-row">
                    <button className="ed-tool" onClick={() => setRotation((r) => (r + 270) % 360)}><svg className="ei" viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M9 4.5 5 8l4 3.5"/><path d="M5 8h8.5a5 5 0 0 1 0 10H9"/></svg> يسار</button>
                    <button className="ed-tool" onClick={() => setRotation((r) => (r + 90) % 360)}><svg className="ei" viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M15 4.5 19 8l-4 3.5"/><path d="M19 8h-8.5a5 5 0 0 0 0 10H15"/></svg> يمين</button>
                  </div>
                  <div className="ed-btn-row">
                    <button className={"ed-tool" + (flipH ? " on" : "")} onClick={() => setFlipH((f) => !f)}><svg className="ei" viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3.5v17" strokeDasharray="2.5 2.5"/><path d="M8.5 8 4.5 12l4 4"/><path d="M15.5 8l4 4-4 4"/></svg> قلب أفقي</button>
                    <button className={"ed-tool" + (flipV ? " on" : "")} onClick={() => setFlipV((f) => !f)}><svg className="ei" viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M3.5 12h17" strokeDasharray="2.5 2.5"/><path d="M8 8.5 12 4.5l4 4"/><path d="M8 15.5l4 4 4-4"/></svg> قلب عمودي</button>
                  </div>
                  <div className="ed-divider" />
                  <div className="ed-gt">قص بنسبة</div>
                  <div className="ed-btn-row" style={{ flexWrap: "wrap" }}>
                    {RATIOS.map(([r, lbl]) => (
                      <button key={r} className={"ed-tool" + (cropRatio === r ? " on" : "")} style={{ flex: "1 0 28%" }}
                        onClick={() => { setCropRatio(r); applyCropRatio(r); }}>{lbl}</button>
                    ))}
                  </div>
                  <button className="ed-apply" onClick={doCrop}>✓ تطبيق القص</button>
                  <div className="ed-hint">اسحب زوايا المربّع لتحديد منطقة القص، ثم اضغط «تطبيق القص».</div>
                </>
              )}

              {tab === "mark" && (
                <>
                  <div className="ed-gt">علامة مائية / شعار</div>
                  <label className="ed-lbl">النص</label>
                  <input className="ed-field" value={wm.text} placeholder="اسمك أو علامتك" onChange={(e) => setWm((p) => ({ ...p, text: e.target.value }))} />
                  <div className="ed-color-row">
                    <span style={{ fontSize: "13px", fontWeight: 600 }}>اللون:</span>
                    {WM_COLORS.map((c) => (
                      <button key={c} className={"ed-swatch" + (wm.color === c ? " on" : "")} style={{ background: c }} onClick={() => setWm((p) => ({ ...p, color: c }))} />
                    ))}
                    <input type="color" value={wm.color} onChange={(e) => setWm((p) => ({ ...p, color: e.target.value }))} />
                  </div>
                  <div className="ed-slider-row">
                    <div className="ed-slider-head"><label>الحجم</label><span className="ed-slider-val">{wm.size}%</span></div>
                    <input type="range" min="2" max="15" step="0.5" value={wm.size} onChange={(e) => setWm((p) => ({ ...p, size: Number(e.target.value) }))} />
                  </div>
                  <div className="ed-slider-row">
                    <div className="ed-slider-head"><label>الشفافية</label><span className="ed-slider-val">{wm.opacity}%</span></div>
                    <input type="range" min="10" max="100" step="5" value={wm.opacity} onChange={(e) => setWm((p) => ({ ...p, opacity: Number(e.target.value) }))} />
                  </div>
                  <label className="ed-lbl">الموقع</label>
                  <div className="ed-pos-grid">
                    {POSITIONS.map((p) => (
                      <button key={p} className={"ed-pos-cell" + (wm.pos === p ? " on" : "")} onClick={() => setWm((s) => ({ ...s, pos: p }))}><span className="ed-dot" /></button>
                    ))}
                  </div>
                  <label className="ed-check">
                    <input type="checkbox" checked={wm.on} onChange={(e) => setWm((p) => ({ ...p, on: e.target.checked }))} /> إظهار العلامة المائية
                  </label>
                </>
              )}

              {tab === "text" && (
                <>
                  <div className="ed-gt">إضافة نص</div>
                  <label className="ed-lbl">النص</label>
                  <input className="ed-field" value={txt.text} placeholder="اكتب نصك هنا…" onChange={(e) => setTxt((p) => ({ ...p, text: e.target.value }))} />
                  <div className="ed-color-row">
                    <span style={{ fontSize: "13px", fontWeight: 600 }}>اللون:</span>
                    {TXT_COLORS.map((c) => (
                      <button key={c} className={"ed-swatch" + (txt.color === c ? " on" : "")} style={{ background: c }} onClick={() => setTxt((p) => ({ ...p, color: c }))} />
                    ))}
                    <input type="color" value={txt.color} onChange={(e) => setTxt((p) => ({ ...p, color: e.target.value }))} />
                  </div>
                  <div className="ed-slider-row">
                    <div className="ed-slider-head"><label>الحجم</label><span className="ed-slider-val">{txt.size}%</span></div>
                    <input type="range" min="3" max="25" step="0.5" value={txt.size} onChange={(e) => setTxt((p) => ({ ...p, size: Number(e.target.value) }))} />
                  </div>
                  <label className="ed-check">
                    <input type="checkbox" checked={txt.shadow} onChange={(e) => setTxt((p) => ({ ...p, shadow: e.target.checked }))} /> ظل للنص (يحسّن الوضوح)
                  </label>
                  <label className="ed-lbl">الموقع</label>
                  <div className="ed-pos-grid">
                    {POSITIONS.map((p) => (
                      <button key={p} className={"ed-pos-cell" + (txt.pos === p ? " on" : "")} onClick={() => {
                        const map = { t: 0.12, m: 0.5, b: 0.88, l: 0.18, c: 0.5, r: 0.82 };
                        setTxt((s) => ({ ...s, pos: p, y: map[p[0]], x: map[p[1]] }));
                      }}><span className="ed-dot" /></button>
                    ))}
                  </div>
                  <div className="ed-hint">تكدر تسحب النص بإصبعك/الماوس فوق الصورة لتحريكه بدقّة.</div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800;900&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&family=Noto+Sans:wght@400;600;800&family=Noto+Sans+Devanagari:wght@400;600;800&display=swap');

.tayf-root{
  --ink:#F4F3EF; --ink2:#ECEBE6; --surface:#FFFFFF; --surface2:#FBFAF7;
  --line:rgba(20,18,30,.09); --text:#17161E; --muted:#6C6A76; --gold:#A97C34; --btn:linear-gradient(135deg,#2A2932,#141319); --btn-ink:#F4F3EF; --spectrum:${SPECTRUM};
  position:relative; min-height:100vh; background:var(--ink); color:var(--text);
  font-family:'Cairo','IBM Plex Sans Arabic','Noto Sans','Noto Sans Devanagari',system-ui,sans-serif; overflow-x:hidden;
  font-size:16.5px; font-weight:500;
}
.tayf-root *{box-sizing:border-box}
svg.ei{vertical-align:-.14em}
.ref-icon svg.ei{vertical-align:middle}
.ed-dl{display:inline-flex;align-items:center;gap:6px}
.tayf-root h1,.tayf-root h2,.tayf-root h3{font-family:'Cairo','Noto Sans','Noto Sans Devanagari',sans-serif;margin:0;font-weight:800;color:var(--text)}
.tayf-root a{color:inherit;text-decoration:none}

/* كانفاس الطيف الضوئي التفاعلي يتبع المؤشر */
.spectrum-canvas{position:fixed;inset:0;z-index:0;pointer-events:none;width:100%;height:100%;opacity:.5;
  background:radial-gradient(70% 55% at 50% 0%,rgba(157,78,255,.06),rgba(244,243,239,0) 55%),radial-gradient(120% 90% at 50% 18%,#F7F6F2 0%,#F4F3EF 55%,#F1F0EB 100%)}

.aurora{display:none}
.wavebg{display:none}

.topbar{position:relative;z-index:3;display:flex;align-items:center;gap:18px;max-width:1080px;margin:0 auto;padding:22px 24px}
.brand{display:flex;align-items:center;gap:10px;margin-inline-end:auto}
.mark{width:30px;height:30px;border-radius:9px;background:var(--spectrum);box-shadow:0 0 18px rgba(157,78,255,.5)}
.brandname{font-weight:900;font-size:25px;letter-spacing:1px}
.brandname.small{font-size:19px}
.nav{display:flex;gap:6px;font-size:15.5px;font-weight:700}
.nav a{position:relative;color:#3A3844;padding:8px 14px;border-radius:10px;transition:.18s;text-decoration:none}
.nav a:hover{color:var(--text);background:rgba(30,28,38,.06)}
.menu-btn{display:none;flex-direction:column;justify-content:center;gap:5px;width:44px;height:44px;background:transparent;border:1px solid var(--line-2,rgba(20,18,30,.16));border-radius:12px;cursor:pointer;padding:0 11px}
.menu-btn span{display:block;height:2px;width:100%;background:var(--text);border-radius:2px;transition:.2s}
.mobile-nav{position:absolute;top:72px;inset-inline:16px;z-index:40;background:var(--surface);border:1px solid var(--line);border-radius:16px;padding:8px;display:flex;flex-direction:column;gap:2px;box-shadow:0 20px 50px -20px rgba(30,25,50,.25)}
.mobile-nav a{padding:13px 16px;border-radius:11px;color:var(--text);font-weight:700;font-size:16px;text-decoration:none}
.mobile-nav a:hover{background:rgba(30,28,38,.06)}
@media(max-width:720px){.nav{display:none}.menu-btn{display:flex}}

.lang-wrap{position:relative}
.lang-btn{display:inline-flex;align-items:center;gap:7px;background:transparent;border:1px solid var(--line);
  color:var(--text);padding:8px 13px;border-radius:999px;font-family:inherit;font-size:14px;cursor:pointer;transition:.2s}
.lang-btn:hover{border-color:rgba(20,18,30,.24)}
.lang-btn svg{width:16px;height:16px;opacity:.85}
.lang-menu{position:absolute;top:calc(100% + 8px);inset-inline-end:0;z-index:20;
  background:var(--surface2);border:1px solid var(--line);border-radius:14px;padding:6px;
  display:grid;grid-template-columns:1fr 1fr;gap:2px;min-width:230px;
  box-shadow:0 24px 60px -20px rgba(30,25,50,.15);backdrop-filter:blur(14px)}
.lang-item{background:transparent;border:none;color:var(--muted);font-family:inherit;font-size:14px;
  text-align:start;padding:9px 12px;border-radius:9px;cursor:pointer;transition:.15s}
.lang-item:hover{background:var(--ink2);color:var(--text)}
.lang-item.on{color:var(--text);background:rgba(157,78,255,.18)}

.ghost-btn{background:transparent;border:1px solid var(--line);color:var(--text);padding:9px 18px;
  border-radius:999px;font-family:inherit;font-size:14.5px;font-weight:600;cursor:pointer;transition:.2s}
.ghost-btn:hover{border-color:rgba(20,18,30,.24)}
@media(max-width:520px){.ghost-btn{display:none}}

main{position:relative;z-index:2;max-width:1080px;margin:0 auto;padding:0 24px 80px}

.hero{text-align:center;padding:56px 0 40px}
.eyebrow{display:inline-block;font-size:13.5px;font-weight:600;letter-spacing:1.5px;color:var(--muted);border:1px solid var(--line);padding:7px 16px;border-radius:999px;margin-bottom:24px}
.hero h1{font-size:clamp(26px,6.2vw,72px);font-weight:800;line-height:1.15;letter-spacing:-1px;color:var(--text);white-space:nowrap}
@media(max-width:380px){.hero h1{white-space:normal}}
.grad{background:var(--spectrum);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
.sub{color:#514F5A;font-size:clamp(16.5px,2vw,20px);max-width:600px;margin:24px auto 0;line-height:1.9;font-weight:500}

.studio{background:linear-gradient(180deg,rgba(255,255,255,.96),rgba(251,250,247,.96));border:1px solid var(--line);
  border-radius:24px;padding:22px;backdrop-filter:blur(14px);box-shadow:0 30px 80px -30px rgba(30,25,50,.15)}
.mode-row{display:flex;gap:8px;background:var(--ink2);border:1px solid var(--line);border-radius:14px;padding:5px;width:max-content;margin:0 auto 18px}
.mode{display:flex;align-items:center;gap:7px;background:transparent;border:none;color:var(--muted);font-family:inherit;font-size:15.5px;font-weight:600;padding:9px 22px;border-radius:10px;cursor:pointer;transition:.2s}
.mode.on{background:var(--surface2);color:var(--text);box-shadow:0 0 0 1px var(--line)}
.lock-badge{display:inline-flex;align-items:center;gap:3px;font-size:11px;font-weight:700;padding:2px 7px;border-radius:8px;background:rgba(201,168,106,.16);color:var(--gold);margin-inline-start:2px}
.mode.locked-mode{opacity:.92}
.mode svg{width:17px;height:17px}

.prompt-box{background:var(--ink2);border:1px solid var(--line);border-radius:16px;padding:14px}
.prompt-box textarea{width:100%;background:transparent;border:none;resize:vertical;color:var(--text);font-family:inherit;font-size:16.5px;font-weight:500;line-height:1.7;outline:none;min-height:74px}
.prompt-box textarea::placeholder{color:#9A97A3}
.prompt-actions{display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin-top:10px;padding-top:12px;border-top:1px solid var(--line)}
.enhance{display:inline-flex;align-items:center;gap:8px;background:rgba(157,78,255,.14);border:1px solid rgba(157,78,255,.4);color:#7A57DB;font-family:inherit;font-size:14.5px;font-weight:600;padding:9px 16px;border-radius:999px;cursor:pointer;transition:.2s}
.enhance:hover:not(:disabled){background:rgba(157,78,255,.24)}
.enhance:disabled{opacity:.5;cursor:default}
.enhance svg{width:16px;height:16px}
.hint{font-size:13.5px;color:var(--muted)}
.err{margin-top:12px;font-size:14px;color:#DC2626;background:rgba(248,113,113,.1);border:1px solid rgba(248,113,113,.3);padding:10px 12px;border-radius:10px}
.enhanced{margin-top:12px;background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:14px}
.enhanced-head{display:flex;align-items:center;justify-content:space-between;font-size:13px;color:#6D4AD6;margin-bottom:8px}
.enhanced-head span{display:inline-flex;align-items:center;gap:6px}
.enhanced-head svg{width:15px;height:15px}
.copy{background:transparent;border:1px solid var(--line);color:var(--text);font-family:inherit;font-size:12px;padding:4px 12px;border-radius:8px;cursor:pointer}
.copy:hover{border-color:rgba(20,18,30,.24)}
.enhanced p{margin:0;font-size:14px;line-height:1.7;color:#4A4954;font-family:'Noto Sans',system-ui,sans-serif;text-align:left}

.control-group{margin-top:20px;padding-top:18px;border-top:1px solid var(--line)}
.control-group:first-child{padding-top:0;border-top:none}
.ctl-label{display:block;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--gold);margin-bottom:12px}
.chips{display:flex;flex-wrap:wrap;gap:8px}
.chip{background:var(--ink2);border:1px solid var(--line);color:var(--text);font-family:inherit;font-size:15px;font-weight:600;padding:9px 17px;border-radius:999px;cursor:pointer;transition:.18s}
.chip:hover{color:var(--text);border-color:rgba(20,18,30,.2)}
.chip.on{background:var(--surface2);color:var(--text);border-color:rgba(157,78,255,.55);box-shadow:0 0 0 1px rgba(157,78,255,.3)}
.control-grid{display:grid;grid-template-columns:1fr 1fr;gap:24px}
@media(max-width:620px){.control-grid{grid-template-columns:1fr}}

.models{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
@media(max-width:620px){.models{grid-template-columns:1fr}}
.model{display:flex;flex-direction:column;gap:5px;text-align:start;background:var(--ink2);border:1px solid var(--line);border-radius:14px;padding:14px;cursor:pointer;font-family:inherit;color:var(--text);transition:.18s}
.model:hover{border-color:rgba(20,18,30,.18)}
.model.on{border-color:rgba(157,78,255,.6);box-shadow:0 0 0 1px rgba(157,78,255,.35);background:linear-gradient(180deg,rgba(157,78,255,.12),var(--ink2))}
.model-top{display:flex;align-items:center;justify-content:space-between;gap:8px}
.model-name{font-weight:700;font-size:16px}
.model-badge{font-size:11px;color:#0B0B10;background:rgba(30,28,38,.09);border:1px solid rgba(30,28,38,.18);padding:3px 9px;border-radius:999px;font-weight:600;white-space:nowrap}
.model-by{font-size:12px;color:var(--muted)}
.model.locked{opacity:.55;cursor:not-allowed}
.model.locked:hover{border-color:var(--line)}
.model-lock{font-size:11px;color:var(--muted);background:var(--ink2);border:1px solid var(--line);
  padding:3px 9px;border-radius:999px;white-space:nowrap}
.model-note{font-size:12.5px;color:#6C6A76;line-height:1.6;margin-top:2px}

.range{width:100%;accent-color:#9D4EFF;margin-top:8px}
.dur-options{display:flex;gap:10px;margin-top:8px}
.dur-btn{flex:1;padding:12px 0;border-radius:12px;border:1px solid var(--line);background:var(--ink2);color:var(--text);font-family:inherit;font-size:15px;font-weight:600;cursor:pointer;transition:.18s}
.dur-btn:hover:not(.disabled){border-color:rgba(201,168,106,.55)}
.dur-btn.active{border-color:transparent;background:var(--btn);color:var(--btn-ink);box-shadow:0 4px 16px rgba(20,18,30,.2)}
.dur-btn.disabled{opacity:.38;cursor:not-allowed}
.range-ticks{display:flex;justify-content:space-between;margin-top:6px;font-size:12px;color:var(--muted)}

.generate{margin-top:26px;width:100%;display:flex;align-items:center;justify-content:center;gap:10px;background:var(--btn);border:none;color:var(--btn-ink);font-family:'Cairo','Noto Sans',sans-serif;font-weight:800;font-size:18px;padding:16px;border-radius:14px;cursor:pointer;transition:.2s;box-shadow:0 14px 40px -12px rgba(20,18,30,.3)}
.generate:hover{transform:translateY(-1px);box-shadow:0 18px 50px -12px rgba(20,18,30,.4)}
.generate svg{width:19px;height:19px}

.results{margin-top:24px}
.empty{text-align:center;color:var(--muted);font-size:14.5px;border:1px dashed var(--line);border-radius:14px;padding:34px 16px}
.results-meta{display:flex;gap:8px;color:var(--muted);font-size:13px;margin-bottom:14px;align-items:center;flex-wrap:wrap}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px}
.card{position:relative;border-radius:14px;background:var(--ink2);border:1px solid var(--line);display:flex;align-items:center;justify-content:center;color:#B9B7BF;overflow:hidden}
.card svg{width:30px;height:30px;position:relative;z-index:1}
.card-glow{position:absolute;inset:0;background:var(--spectrum);opacity:.1}
.card-num{position:absolute;top:8px;inset-inline-start:10px;font-size:12px;color:var(--muted)}
.card-actions{position:absolute;top:8px;inset-inline-end:8px;display:flex;gap:6px;z-index:2;opacity:0;transition:.18s}
.card:hover .card-actions{opacity:1}
.card-act{display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:10px;
  background:rgba(10,10,16,.62);border:1px solid rgba(20,18,30,.14);color:#fff;cursor:pointer;backdrop-filter:blur(6px);transition:.15s}
.card-act:hover{background:rgba(10,10,16,.85);border-color:rgba(20,18,30,.3)}
.card-act svg{width:18px;height:18px}
@media(hover:none){.card-actions{opacity:1}}

.lb-overlay{position:fixed;inset:0;z-index:60;background:rgba(10,8,16,.88);backdrop-filter:blur(10px);
  display:flex;align-items:center;justify-content:center;padding:24px;animation:fade .2s ease}
.lb-close{position:absolute;top:18px;inset-inline-end:22px;background:transparent;border:none;color:#fff;
  font-size:34px;line-height:1;cursor:pointer;opacity:.85}
.lb-close:hover{opacity:1}
.lb-stage{display:flex;flex-direction:column;align-items:center;gap:16px;max-width:92vw;max-height:88vh}
.lb-media{max-width:92vw;max-height:74vh;border-radius:14px;box-shadow:0 30px 90px -20px rgba(30,25,50,.2);object-fit:contain}
.lb-download{display:inline-flex;align-items:center;gap:9px;background:var(--btn);border:none;color:var(--btn-ink);
  font-family:'Cairo','Noto Sans',sans-serif;font-weight:800;font-size:16px;padding:13px 28px;border-radius:999px;
  cursor:pointer;transition:.2s;box-shadow:0 12px 34px -12px rgba(110,126,168,.35)}
.lb-download:hover{transform:translateY(-1px)}
.lb-download svg{width:18px;height:18px}
.note{margin-top:16px;font-size:13px;color:var(--muted);line-height:1.8;background:var(--ink2);border:1px solid var(--line);border-radius:12px;padding:14px}

.gallery{margin-top:72px}
.mywork{margin-top:64px}
.mywork-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:22px}
.mywork-head h2{font-size:clamp(26px,4vw,36px);font-weight:800;letter-spacing:-.5px}
.mywork-head-actions{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.fav-filter{display:inline-flex;background:var(--ink2);border:1px solid var(--line);border-radius:999px;padding:3px;gap:2px}
.fav-tab{padding:6px 14px;border:none;background:transparent;color:var(--muted);font-family:inherit;font-size:13px;font-weight:600;border-radius:999px;cursor:pointer;transition:.18s}
.fav-tab.on{background:var(--surface2);color:var(--text)}
.fav-tab:hover{color:var(--text)}
.mw-fav.card-act.on{color:var(--gold);border-color:rgba(201,168,106,.6);background:rgba(201,168,106,.14)}
.mw-fav{font-size:18px;font-weight:700}
.mw-fav-flag{position:absolute;top:8px;inset-inline-start:8px;z-index:2;color:var(--gold);font-size:18px;
  text-shadow:0 1px 4px rgba(0,0,0,.7);pointer-events:none}
.mywork-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:14px}
.mw-card{background:var(--ink2);border:1px solid var(--line);border-radius:14px;overflow:hidden;display:flex;flex-direction:column}
.mw-media{position:relative;aspect-ratio:1/1;background:var(--surface);cursor:pointer;overflow:hidden}
.mw-media img,.mw-media video{width:100%;height:100%;object-fit:cover;display:block}
.mw-actions{position:absolute;top:8px;inset-inline-end:8px;display:flex;gap:6px;opacity:0;transition:.18s}
.mw-card:hover .mw-actions{opacity:1}
@media(hover:none){.mw-actions{opacity:1}}
.mw-del:hover{background:rgba(220,38,38,.85)!important;border-color:rgba(248,113,113,.6)!important}
.mw-info{padding:11px 12px;display:flex;flex-direction:column;gap:8px}
.mw-prompt{margin:0;font-size:13px;color:var(--muted);line-height:1.6;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.mw-copy{align-self:flex-start;background:transparent;border:1px solid var(--line);color:var(--text);font-family:inherit;font-size:11.5px;padding:4px 12px;border-radius:8px;cursor:pointer;transition:.15s}
.mw-copy:hover{border-color:rgba(20,18,30,.24)}

.gallery h2,.features h2{font-size:clamp(28px,4.5vw,42px);font-weight:800;text-align:center;margin-bottom:30px;letter-spacing:-.5px}
.gal-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
@media(max-width:620px){.gal-grid{grid-template-columns:repeat(2,1fr)}}
.gal{position:relative;aspect-ratio:3/4;border-radius:16px;border:1px solid var(--line);overflow:hidden}
.gal-tag{position:absolute;bottom:10px;inset-inline-start:12px;font-size:12px;background:rgba(0,0,0,.4);padding:4px 10px;border-radius:8px;backdrop-filter:blur(4px);font-weight:600}

.features{margin-top:80px}
.feat-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
@media(max-width:860px){.feat-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:480px){.feat-grid{grid-template-columns:1fr}}
.feat{background:var(--surface);border:1px solid var(--line);border-radius:18px;padding:24px;transition:.3s}
.feat:hover{transform:translateY(-4px);border-color:rgba(20,18,30,.16)}
.feat-ic{display:inline-flex;width:46px;height:46px;align-items:center;justify-content:center;border-radius:13px;background:rgba(157,78,255,.14);color:#6D4AD6;margin-bottom:16px}
.feat-ic svg{width:22px;height:22px}
.feat h3{font-size:20px;font-weight:700;margin-bottom:9px}
.feat p{font-size:14.5px;color:var(--muted);line-height:1.85;margin:0}

.footer{margin-top:90px;border-top:1px solid var(--line);padding:34px 0 12px;
  display:flex;flex-direction:column;align-items:center;gap:16px}
.footer-top{display:flex;align-items:center;gap:24px;flex-wrap:wrap;justify-content:center}
.footer-brand{display:inline-flex;align-items:center;gap:9px;text-decoration:none;color:var(--text)}
.footer-logo{width:30px;height:30px;border-radius:9px;flex:none}
.footer-links{display:flex;gap:8px;flex-wrap:wrap;justify-content:center}
.footer-links a{color:var(--muted);font-size:13.5px;text-decoration:none;padding:6px 13px;
  border-radius:9px;border:1px solid var(--line);transition:.16s}
.footer-links a:hover{color:var(--text);border-color:rgba(201,168,106,.5)}
.footer-tag{color:var(--muted);font-size:13px;text-align:center;max-width:540px;line-height:1.7}
.footer-copy{color:#8A8892;font-size:12.5px;text-align:center}
.footer-social{display:flex;gap:12px;align-items:center;justify-content:center;margin:2px 0 4px}
.footer-social a{display:inline-flex;align-items:center;justify-content:center;width:44px;height:44px;
  border-radius:12px;border:1px solid var(--line);color:var(--muted);background:var(--ink2);transition:.18s}
.footer-social a:hover{transform:translateY(-2px)}
.footer-social a.wa:hover{color:#25D366;border-color:#25D366}
.footer-social a.fb:hover{color:#1877F2;border-color:#1877F2}
.footer-social a.ig:hover{color:#E1306C;border-color:#E1306C}
.footer-social a.em:hover{color:var(--gold);border-color:var(--gold)}
.footer-social svg{width:21px;height:21px}

.ghost-btn.small{padding:7px 14px;font-size:13px}
.acct{display:flex;align-items:center;gap:12px}
.acct-credits{display:inline-flex;align-items:center;gap:6px;font-size:13px;color:#7A57DB;
  background:rgba(157,78,255,.14);border:1px solid rgba(157,78,255,.4);padding:6px 12px;border-radius:999px;white-space:nowrap}
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
  border-radius:50%;background:#2A2932;color:#F4F3EF;font-size:12px;font-weight:800}
@media(max-width:620px){.acct-name{display:none}}

.trial-cta{margin-top:26px;display:inline-flex;align-items:center;gap:9px;background:var(--btn);
  border:none;color:var(--btn-ink);font-family:'Cairo','Noto Sans',sans-serif;font-weight:800;font-size:16.5px;
  padding:14px 28px;border-radius:999px;cursor:pointer;transition:.2s;box-shadow:0 14px 40px -12px rgba(20,18,30,.3)}
.trial-cta:hover{transform:translateY(-1px);box-shadow:0 18px 50px -12px rgba(20,18,30,.4)}
.trial-cta svg{width:17px;height:17px}

.cost-hint{margin-top:12px;display:flex;align-items:center;justify-content:center;gap:7px;font-size:13.5px;color:var(--muted)}
.cost-hint svg{width:14px;height:14px;color:#6D4AD6}
.nocredit{margin-top:16px;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;
  background:rgba(251,191,36,.1);border:1px solid rgba(251,191,36,.35);border-radius:12px;padding:14px 16px;
  font-size:14px;color:#B45309}
.upgrade{background:var(--btn);border:none;color:var(--btn-ink);font-family:inherit;font-weight:700;
  font-size:14px;padding:9px 20px;border-radius:999px;cursor:pointer;white-space:nowrap}

.modal-overlay{position:fixed;inset:0;z-index:50;background:rgba(30,25,45,.5);backdrop-filter:blur(8px);
  display:flex;align-items:center;justify-content:center;padding:20px;animation:fade .2s ease}
@keyframes fade{from{opacity:0}to{opacity:1}}
.modal{position:relative;width:100%;max-width:400px;background:var(--surface2);border:1px solid var(--line);
  border-radius:22px;padding:30px 26px 22px;box-shadow:0 40px 100px -30px rgba(30,25,50,.2)}
.modal-close{position:absolute;top:14px;inset-inline-end:16px;display:inline-flex;align-items:center;justify-content:center;
  width:34px;height:34px;background:var(--ink2);border:1px solid var(--line);border-radius:999px;
  color:var(--muted);font-size:22px;line-height:1;cursor:pointer;transition:.2s}
.modal-close:hover{color:var(--text);background:var(--surface2);border-color:rgba(20,18,30,.22);transform:rotate(90deg)}
.modal-trial{display:inline-flex;align-items:center;gap:6px;font-size:12px;color:#0B0B10;
  background:rgba(30,28,38,.09);border:1px solid rgba(30,28,38,.18);padding:4px 12px;border-radius:999px;font-weight:700;margin-bottom:14px}
.modal-trial svg{width:13px;height:13px}
.modal-title{font-size:25px;font-weight:900;margin-bottom:6px}
.modal-sub{color:var(--muted);font-size:14.5px;margin:0 0 20px}
.fields{display:flex;flex-direction:column;gap:10px}
.field{background:var(--ink2);border:1px solid var(--line);border-radius:12px;padding:13px 15px;
  color:var(--text);font-family:inherit;font-size:15px;outline:none;transition:.18s;width:100%}
.field::placeholder{color:#9A97A3}
.field:focus{border-color:rgba(157,78,255,.6);box-shadow:0 0 0 1px rgba(157,78,255,.3)}
.modal-submit{margin-top:16px;width:100%;background:var(--btn);border:none;color:var(--btn-ink);
  font-family:'Cairo','Noto Sans',sans-serif;font-weight:800;font-size:16.5px;padding:14px;border-radius:12px;
  cursor:pointer;transition:.2s;box-shadow:0 12px 34px -12px rgba(20,18,30,.3)}
.modal-submit:hover{transform:translateY(-1px)}
.modal-toggle{margin-top:14px;width:100%;background:transparent;border:none;color:var(--muted);
  font-family:inherit;font-size:14px;cursor:pointer}
.modal-toggle:hover{color:var(--text)}
.modal-demo{margin:16px 0 0;font-size:11.5px;color:#9A97A3;line-height:1.6;text-align:center;
  border-top:1px solid var(--line);padding-top:14px}

.plans-modal{max-width:760px}
.plans{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:8px}
@media(max-width:640px){.plans{grid-template-columns:1fr}}
.plan{position:relative;display:flex;flex-direction:column;gap:8px;background:var(--ink2);
  border:1px solid var(--line);border-radius:16px;padding:20px 18px}
.plan.popular{border-color:rgba(157,78,255,.6);box-shadow:0 0 0 1px rgba(157,78,255,.35)}
.plan-pop{position:absolute;top:-10px;inset-inline-start:18px;font-size:11px;color:#0B0B10;
  background:rgba(30,28,38,.09);border:1px solid rgba(30,28,38,.18);padding:3px 10px;border-radius:999px;font-weight:700}
.plan-name{font-family:'Cairo','Noto Sans',sans-serif;font-weight:700;font-size:18px}
.plan-price{font-family:'Cairo','Noto Sans',sans-serif;font-weight:800;font-size:32px}
.plan-price small{font-size:14px;color:var(--muted);font-weight:500}
.plan-credits{font-size:14px;color:#6D4AD6}
.plan-feature{font-size:13px;color:var(--muted)}
.plan-btn{margin-top:8px;background:var(--btn);border:none;color:var(--btn-ink);
  font-family:'Cairo','Noto Sans',sans-serif;font-weight:800;font-size:15px;padding:12px;
  border-radius:11px;cursor:pointer;transition:.2s}
.plan-btn:hover{transform:translateY(-1px)}

:focus-visible{outline:2px solid #9D4EFF;outline-offset:2px;border-radius:6px}
@media(prefers-reduced-motion:reduce){.generate:hover{transform:none}.feat:hover{transform:none}}

/* ===== لوحة الأدمن ===== */
.admin-open-btn{border-color:rgba(201,168,106,.5)!important;color:var(--gold)!important}
.admin-open-btn:hover{background:rgba(201,168,106,.12)!important}
.admin-modal{max-width:860px;max-height:88vh;overflow-y:auto}
.admin-loading{padding:40px 0;text-align:center;color:var(--muted);font-size:15px}
.admin-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin:6px 0 18px}
@media(max-width:680px){.admin-stats{grid-template-columns:repeat(2,1fr)}}
.admin-stat{background:var(--ink2);border:1px solid var(--line);border-radius:14px;padding:14px 12px;
  display:flex;flex-direction:column;gap:4px;align-items:center;text-align:center}
.admin-stat-num{font-family:'Cairo','Noto Sans',sans-serif;font-weight:800;font-size:24px;color:var(--text)}
.admin-stat-lbl{font-size:12.5px;color:var(--muted)}
.admin-toolbar{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:6px}
.admin-count{font-size:13.5px;color:var(--muted)}
.admin-search-wrap{position:relative;margin:8px 0 14px}
.admin-search{width:100%;background:var(--ink2);border:1px solid var(--line);border-radius:12px;
  padding:11px 40px 11px 14px;color:var(--text);font-size:14px;font-family:inherit;outline:none;transition:.2s}
.admin-search::placeholder{color:var(--muted)}
.admin-search:focus{border-color:var(--gold);background:var(--surface)}
.admin-search-clear{position:absolute;inset-inline-end:8px;top:50%;transform:translateY(-50%);
  width:26px;height:26px;display:inline-flex;align-items:center;justify-content:center;
  background:var(--surface2);border:1px solid var(--line);border-radius:999px;color:var(--muted);
  font-size:17px;line-height:1;cursor:pointer;transition:.15s}
.admin-search-clear:hover{color:var(--text);border-color:rgba(20,18,30,.22)}
.admin-users{display:flex;flex-direction:column;gap:10px;margin-top:12px}
.admin-user{background:var(--ink2);border:1px solid var(--line);border-radius:14px;padding:14px 15px;
  display:flex;flex-direction:column;gap:10px;transition:.18s}
.admin-user.busy{opacity:.55;pointer-events:none}
.admin-user-main{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;flex-wrap:wrap}
.admin-user-id{display:flex;flex-direction:column;gap:2px;min-width:0}
.admin-user-name{font-weight:700;font-size:15px;color:var(--text)}
.admin-user-email{font-size:12.5px;color:var(--muted);word-break:break-all}
.admin-badges{display:flex;gap:6px;flex-wrap:wrap}
.admin-badge{font-size:11px;font-weight:700;padding:3px 9px;border-radius:999px;white-space:nowrap}
.admin-badge-gold{background:rgba(201,168,106,.16);color:var(--gold);border:1px solid rgba(201,168,106,.4)}
.admin-badge-ok{background:rgba(52,211,153,.14);color:#0E9E76;border:1px solid rgba(52,211,153,.3)}
.admin-badge-mut{background:var(--surface2);color:var(--muted);border:1px solid var(--line)}
.admin-badge-sub{background:rgba(157,78,255,.16);color:#6D4AD6;border:1px solid rgba(157,78,255,.4)}
.admin-user-meta{display:flex;align-items:center;gap:8px;flex-wrap:wrap;font-size:12.5px;color:var(--muted)}
.admin-credits{display:inline-flex;align-items:center;gap:5px;color:#7A57DB}
.admin-credits svg{width:13px;height:13px}
.admin-meta-dot{opacity:.5}
.admin-actions{display:flex;gap:7px;flex-wrap:wrap}
.admin-btn{background:var(--surface2);border:1px solid var(--line);color:var(--text);
  font-family:inherit;font-size:12.5px;font-weight:600;padding:7px 12px;border-radius:9px;
  cursor:pointer;transition:.15s}
.admin-btn:hover{border-color:rgba(157,78,255,.5);background:var(--ink2)}
.admin-btn:disabled{opacity:.45;cursor:not-allowed}
.admin-btn-danger{color:#DC2626;border-color:rgba(255,90,90,.3)}
.admin-btn-danger:hover{background:rgba(255,90,90,.12);border-color:rgba(255,90,90,.6)}
.admin-empty{padding:30px 0;text-align:center;color:var(--muted)}

/* المؤشّر: سهم عادي بكل الموقع، ويد فقط فوق الصور والفيديوات */
.tayf-root, .tayf-root *{cursor:default}
.tayf-root input, .tayf-root textarea{cursor:text}
.tayf-root img, .tayf-root video, .tayf-root .mw-media{cursor:pointer}

/* ===== محرّر الصور ===== */
.ed-overlay{position:fixed;inset:0;z-index:200;background:rgba(30,25,45,.5);backdrop-filter:blur(8px);
  display:flex;align-items:center;justify-content:center;padding:18px}
.ed-modal{background:var(--ink);border:1px solid var(--line);border-radius:20px;width:min(1100px,100%);
  height:min(92vh,860px);display:flex;flex-direction:column;overflow:hidden;box-shadow:0 40px 120px -30px rgba(30,25,50,.2)}
.ed-topbar{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:13px 18px;
  border-bottom:1px solid var(--line);background:var(--ink2)}
.ed-brand{display:flex;align-items:center;gap:10px;font-size:16px}
.ed-mark{width:30px;height:30px;border-radius:9px;background:linear-gradient(115deg,#9D4EFF,#FF2E97,#22B4EE);
  display:flex;align-items:center;justify-content:center;font-weight:900;color:#fff;font-size:15px}
.ed-top-actions{display:flex;gap:8px;align-items:center}
.ed-btn{padding:8px 14px;border-radius:10px;border:1px solid var(--line);background:var(--ink2);
  color:var(--text);font-size:13px;font-weight:700;font-family:inherit;cursor:pointer;transition:.15s}
.ed-btn:hover{border-color:rgba(20,18,30,.22);background:var(--surface2)}
.ed-btn:disabled{opacity:.45;cursor:not-allowed}
.ed-btn-gold{background:linear-gradient(115deg,#9D4EFF,#FF2E97,#22B4EE);border:none;color:#0B0B10;font-weight:800}
.ed-close{width:34px;height:34px;padding:0;border-radius:999px;font-size:20px;line-height:1}
.ed-wrap{display:grid;grid-template-columns:1fr 340px;flex:1;min-height:0}
.ed-stage{display:flex;align-items:center;justify-content:center;position:relative;padding:22px;
  background:radial-gradient(circle at 30% 20%,rgba(157,78,255,.06),transparent 60%),var(--ink);min-height:0}
.ed-canvas-host{position:relative;max-width:100%;max-height:100%;line-height:0;border-radius:12px;overflow:hidden;
  box-shadow:0 20px 60px -25px rgba(30,25,50,.2)}
.ed-view{max-width:100%;max-height:64vh;display:block;touch-action:none}
.ed-overlay-canvas{position:absolute;inset:0;width:100%;height:100%;cursor:crosshair;touch-action:none}
.ed-msg{color:var(--muted);font-size:14px}
.ed-tip{position:absolute;bottom:14px;left:50%;transform:translateX(-50%);font-size:11.5px;color:var(--muted);
  background:rgba(255,255,255,.9);padding:5px 12px;border-radius:999px;border:1px solid var(--line);white-space:nowrap}
.ed-panel{background:var(--ink2);border-inline-start:1px solid var(--line);display:flex;flex-direction:column;min-height:0}
.ed-tabs{display:flex;border-bottom:1px solid var(--line);flex-shrink:0}
.ed-tab{flex:1;padding:11px 4px;background:none;border:none;color:var(--muted);font-size:11.5px;font-weight:700;
  font-family:inherit;border-bottom:2px solid transparent;cursor:pointer;transition:.15s}
.ed-tab.on{color:var(--gold);border-bottom-color:var(--gold)}
.ed-tab:hover{color:var(--text)}
.ed-ti{display:flex;align-items:center;justify-content:center;margin-bottom:4px}
.ed-ti svg{width:20px;height:20px}
.ed-body{padding:18px;overflow-y:auto;flex:1}
.ed-gt{font-size:11px;font-weight:800;letter-spacing:.07em;color:var(--gold);margin:2px 0 13px;text-transform:uppercase}
.ed-slider-row{margin-bottom:15px}
.ed-slider-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:6px}
.ed-slider-head label{font-size:13px;font-weight:600}
.ed-slider-val{font-size:11.5px;color:var(--muted);background:var(--surface2);padding:2px 8px;border-radius:6px;min-width:40px;text-align:center;font-variant-numeric:tabular-nums}
.ed-reset-mini{font-size:10.5px;color:var(--muted);background:none;border:none;text-decoration:underline;cursor:pointer;padding:0 3px}
.ed-reset-mini:hover{color:var(--gold)}
.ed-body input[type=range]{-webkit-appearance:none;appearance:none;width:100%;height:5px;border-radius:99px;background:var(--surface2);outline:none}
.ed-body input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:16px;height:16px;border-radius:50%;background:var(--gold);cursor:pointer;border:2px solid var(--ink)}
.ed-body input[type=range]::-moz-range-thumb{width:14px;height:14px;border-radius:50%;background:var(--gold);cursor:pointer;border:2px solid var(--ink)}
.ed-preset-grid{display:grid;grid-template-columns:1fr 1fr;gap:9px}
.ed-preset{padding:12px 8px;border-radius:11px;border:1px solid var(--line);background:var(--surface);color:var(--text);font-size:13px;font-weight:700;font-family:inherit;cursor:pointer;transition:.15s}
.ed-preset:hover{border-color:var(--gold);background:var(--surface2)}
.ed-preset.on{border-color:var(--gold);background:rgba(201,168,106,.13);color:var(--gold)}
.ed-btn-row{display:flex;gap:8px;margin-bottom:12px}
.ed-tool{flex:1;padding:10px 6px;border-radius:10px;border:1px solid var(--line);background:var(--surface);color:var(--text);font-size:12.5px;font-weight:700;font-family:inherit;cursor:pointer;transition:.15s}
.ed-tool:hover{border-color:var(--gold);background:var(--surface2)}
.ed-tool.on{border-color:var(--gold);background:rgba(201,168,106,.13);color:var(--gold)}
.ed-divider{height:1px;background:var(--line);margin:16px 0}
.ed-apply{width:100%;margin-top:6px;padding:11px;border-radius:11px;border:none;background:linear-gradient(115deg,#9D4EFF,#FF2E97,#22B4EE);color:#0B0B10;font-weight:800;font-size:13.5px;font-family:inherit;cursor:pointer}
.ed-apply:hover{filter:brightness(1.08)}
.ed-lbl{font-size:12.5px;font-weight:600;margin:13px 0 7px;display:block}
.ed-field{width:100%;background:var(--surface);border:1px solid var(--line);border-radius:10px;padding:10px 12px;color:var(--text);font-size:13.5px;font-family:inherit;outline:none;transition:.15s}
.ed-field:focus{border-color:var(--gold)}
.ed-color-row{display:flex;gap:8px;align-items:center;margin:11px 0}
.ed-swatch{width:28px;height:28px;border-radius:7px;border:2px solid var(--line);cursor:pointer;padding:0}
.ed-swatch.on{border-color:var(--gold);transform:scale(1.12)}
.ed-color-row input[type=color]{width:34px;height:28px;border:1px solid var(--line);border-radius:7px;background:none;cursor:pointer;padding:2px}
.ed-pos-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;max-width:140px;margin:6px 0 14px}
.ed-pos-cell{aspect-ratio:1;border-radius:8px;border:1px solid var(--line);background:var(--surface);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:.15s}
.ed-pos-cell:hover{border-color:var(--gold)}
.ed-pos-cell.on{border-color:var(--gold);background:rgba(201,168,106,.18)}
.ed-dot{width:7px;height:7px;border-radius:50%;background:var(--muted)}
.ed-pos-cell.on .ed-dot{background:var(--gold)}
.ed-check{display:flex;align-items:center;gap:8px;font-size:13px;font-weight:600;cursor:pointer;margin:10px 0}
.ed-hint{font-size:11.5px;color:var(--muted);line-height:1.6;margin-top:10px}
.ed-hidden{display:none!important}
@media(max-width:860px){
  .ed-wrap{grid-template-columns:1fr;grid-template-rows:1fr auto}
  .ed-panel{border-inline-start:none;border-top:1px solid var(--line);max-height:42vh}
  .ed-view{max-height:38vh}
}


/* ===== نافذة المشاركة ===== */
.share-modal{max-width:380px}
.share-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:8px}
.share-opt{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:9px;
  padding:18px 10px;border-radius:14px;border:1px solid var(--line);background:var(--surface);
  color:var(--text);font-size:13.5px;font-weight:700;font-family:inherit;cursor:pointer;transition:.16s;text-decoration:none}
.share-opt:hover{transform:translateY(-2px);border-color:rgba(20,18,30,.22);background:var(--surface2)}
.share-opt svg{width:30px;height:30px}
.share-wa svg{color:#25D366}
.share-tg svg{color:#2AABEE}
.share-fb svg{color:#1877F2}
.share-copy svg{color:var(--gold)}


/* ===== زر ونافذة القوالب ===== */
.tpl-btn{display:inline-flex;align-items:center;gap:7px;background:var(--surface2);border:1px solid var(--line);
  color:var(--text);font-family:inherit;font-size:13.5px;font-weight:700;padding:9px 15px;border-radius:11px;cursor:pointer;transition:.16s}
.tpl-btn:hover{border-color:var(--gold);color:var(--gold)}
.tpl-btn svg{width:16px;height:16px}
.tpl-modal{max-width:640px}
.tpl-cats{display:flex;gap:8px;flex-wrap:wrap;margin:6px 0 18px}
.tpl-cat{display:inline-flex;align-items:center;gap:7px;padding:9px 15px;border-radius:999px;border:1px solid var(--line);
  background:var(--surface);color:var(--muted);font-family:inherit;font-size:13.5px;font-weight:700;cursor:pointer;transition:.16s}
.tpl-cat:hover{color:var(--text);border-color:rgba(20,18,30,.2)}
.tpl-cat.on{background:rgba(201,168,106,.14);border-color:var(--gold);color:var(--gold)}
.tpl-cat-ic{font-size:15px}
.tpl-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.tpl-card{text-align:start;background:var(--surface);border:1px solid var(--line);border-radius:14px;padding:16px;
  cursor:pointer;transition:.16s;display:flex;flex-direction:column;gap:7px}
.tpl-card:hover{border-color:var(--gold);background:var(--surface2);transform:translateY(-2px)}
.tpl-card-title{font-family:'Cairo',sans-serif;font-weight:800;font-size:15px;color:var(--text)}
.tpl-card-desc{font-size:12.5px;color:var(--muted);line-height:1.6;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
@media(max-width:560px){.tpl-grid{grid-template-columns:1fr}}


/* ===== قسم الإحالة ===== */
.referral{max-width:1120px;margin:0 auto;padding:20px 22px 0}
.ref-card{background:
    radial-gradient(120% 100% at 50% 0%, rgba(157,78,255,.12) 0%, rgba(244,243,239,0) 60%),
    var(--ink2);
  border:1px solid var(--line);border-radius:22px;padding:34px 26px;text-align:center;position:relative;overflow:hidden}
.ref-card::before{content:"";position:absolute;inset:0;border-radius:22px;padding:1px;
  background:linear-gradient(115deg,rgba(157,78,255,.5),rgba(255,46,151,.4),rgba(34,180,238,.5));
  -webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);
  -webkit-mask-composite:xor;mask-composite:exclude;pointer-events:none;opacity:.5}
.ref-icon{font-size:40px;margin-bottom:10px}
.ref-title{font-family:'Cairo',sans-serif;font-weight:900;font-size:26px;margin-bottom:10px}
.ref-desc{color:var(--muted);font-size:15px;line-height:1.8;max-width:520px;margin:0 auto 16px}
.ref-bonus-tag{display:inline-block;background:rgba(30,28,38,.09);border:1px solid rgba(30,28,38,.18);color:#0B0B10;font-weight:800;font-size:13.5px;
  padding:6px 16px;border-radius:999px;margin-bottom:20px}
.ref-link-row{display:flex;gap:10px;max-width:540px;margin:0 auto 12px;flex-wrap:wrap}
.ref-link-input{flex:1;min-width:200px;background:var(--ink);border:1px solid var(--line);border-radius:12px;
  padding:13px 16px;color:var(--text);font-size:14px;font-family:inherit;outline:none;text-align:center;direction:ltr}
.ref-link-input:focus{border-color:var(--gold)}
.ref-copy-btn{display:inline-flex;align-items:center;gap:8px;background:var(--btn);border:none;color:var(--btn-ink);
  font-family:inherit;font-weight:800;font-size:14px;padding:0 20px;border-radius:12px;cursor:pointer;transition:.16s;white-space:nowrap}
.ref-copy-btn:hover{filter:brightness(1.08)}
.ref-copy-btn svg{width:17px;height:17px}
.ref-share-row{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:6px}
.ref-share{display:inline-flex;align-items:center;gap:8px;text-decoration:none;font-family:'Cairo',sans-serif;
  font-weight:700;font-size:14px;padding:11px 20px;border-radius:12px;transition:.16s;color:#fff}
.ref-share.wa{background:#25D366;color:#06351b}
.ref-share.tg{background:#2AABEE;color:#052a3d}
.ref-share:hover{transform:translateY(-1px);filter:brightness(1.05)}
.ref-share svg{width:19px;height:19px}
.ref-count{margin-top:20px;padding-top:18px;border-top:1px solid var(--line);color:var(--muted);font-size:15px}
.ref-count b{color:var(--gold);font-size:20px;font-weight:800}
@media(max-width:560px){.ref-title{font-size:22px}.ref-copy-btn{width:100%;padding:12px}}

`;
