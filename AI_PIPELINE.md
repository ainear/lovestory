# AI_PIPELINE.md — LoveStory AI Video Generation Pipeline

## 1. Pipeline Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                  AI Video Generation Pipeline                    │
│                                                                  │
│  User Input                                                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │ Photos   │  │ Music    │  │ Text     │  │ Template │        │
│  │ (5-20)   │  │ Track    │  │ Info     │  │ Preset   │        │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘        │
│       │              │              │              │              │
│       ▼              ▼              ▼              ▼              │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │              Step 1: VALIDATE & PREPROCESS               │    │
│  │  • File type check    • Resize to target resolution     │    │
│  │  • Virus scan (opt)   • EXIF orientation fix            │    │
│  │  • Size limit check   • Color profile normalize (sRGB)  │    │
│  └──────────────────────────┬───────────────────────────────┘    │
│                             │                                    │
│                             ▼                                    │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │              Step 2: AI ENHANCEMENTS                     │    │
│  │                                                          │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │    │
│  │  │ Face Detect  │  │ BG Removal   │  │ Smart Crop   │   │    │
│  │  │ (face-api.js)│  │ (rembg)      │  │ (rule-of-3)  │   │    │
│  │  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘   │    │
│  │         │                 │                 │            │    │
│  │         ▼                 ▼                 ▼            │    │
│  │  ┌──────────────────────────────────────────────────┐    │    │
│  │  │           Processed Photo Pool                   │    │    │
│  │  └──────────────────────────┬───────────────────────┘    │    │
│  └──────────────────────────────┼───────────────────────────┘    │
│                                 │                                │
│                                 ▼                                │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │              Step 3: AI TEXT GENERATION                   │    │
│  │                                                          │    │
│  │  Input: { groomName, brideName, weddingDate, story }     │    │
│  │  Model: Google Gemini API                                │    │
│  │                                                          │    │
│  │  Output:                                                 │    │
│  │  • Title text: "Minh & Hoa"                             │    │
│  │  • Date text: "25.12.2026"                              │    │
│  │  • Love story: "Câu chuyện bắt đầu từ mùa thu..."      │    │
│  │  • Poem: Short romantic verse                            │    │
│  │  • Closing: "Save the Date" / "Trân trọng kính mời"    │    │
│  └──────────────────────────────┬───────────────────────────┘    │
│                                 │                                │
│                                 ▼                                │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │              Step 4: FFMPEG COMPOSITING                  │    │
│  │                                                          │
│  │  Template Engine resolves:                               │    │
│  │  • Photo sequence + Ken Burns params                     │    │
│  │  • Transition type per cut (crossfade/slide/zoom)        │    │
│  │  • Text overlay positions + animations                   │    │
│  │  • Music sync points (beat detection optional)           │    │
│  │                                                          │    │
│  │  FFmpeg filter_complex:                                  │    │
│  │  [photo1] → zoompan → fade → [seg1]                     │    │
│  │  [photo2] → zoompan → fade → [seg2]                     │    │
│  │  [seg1][seg2] → xfade=crossfade → [merged]              │    │
│  │  [merged] → drawtext → [with_text]                      │    │
│  │  [with_text] + [music] → final.mp4                      │    │
│  └──────────────────────────────┬───────────────────────────┘    │
│                                 │                                │
│                                 ▼                                │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │              Step 5: POST-PROCESSING                     │    │
│  │                                                          │    │
│  │  • Add watermark (free tier)                             │    │
│  │  • Generate thumbnail at 3s mark                         │    │
│  │  • Encode preview (720p, CRF 28, fast)                   │    │
│  │  • Encode final (1080p/4K, CRF 22, slow)                │    │
│  │  • Upload to R2                                          │    │
│  │  • Webhook callback → update DB                          │    │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Detailed Step Specifications

### Step 1: Validate & Preprocess

```typescript
interface PreprocessConfig {
  maxPhotos: 20;
  maxPhotoSizeMb: 10;
  targetWidth: 1920;  // For 1080p output
  targetHeight: 1080;
  allowedFormats: ['jpg', 'jpeg', 'png', 'webp', 'heic'];
  colorSpace: 'srgb';
}

// Process each photo:
// 1. sharp() → resize to targetWidth maintaining aspect ratio
// 2. sharp() → convert to sRGB color space
// 3. sharp() → auto-orient (fix EXIF rotation)
// 4. Output: processed/{photo_id}.jpg (quality 90)
```

**Libraries:** sharp (Node.js image processing)

---

### Step 2: AI Enhancements

#### 2a. Face Detection

```typescript
interface FaceDetectionResult {
  photoId: string;
  faces: Array<{
    bbox: { x: number; y: number; width: number; height: number };
    confidence: number;
    landmarks: { leftEye: Point; rightEye: Point; nose: Point };
  }>;
  suggestedCrop: { x: number; y: number; width: number; height: number };
}

// Library: face-api.js (TinyFaceDetector model)
// Usage: Detect faces → compute centroid → suggest crop region
//        ensuring faces are in center/golden-ratio position
```

#### 2b. Background Removal

```typescript
interface BackgroundRemovalConfig {
  model: 'u2net' | 'u2netp' | 'isnet-general-use';
  alphaMatte: boolean; // Feathered edges
  outputFormat: 'png'; // Transparency preserved
}

// Service: Python microservice running rembg
// API: POST /api/remove-bg { image: base64 } → { result: base64 }
// Deployment: Sidecar container on Fly.io
```

#### 2c. Smart Crop (Rule of Thirds)

```typescript
function smartCrop(
  imageWidth: number,
  imageHeight: number,
  faces: FaceDetectionResult['faces'],
  targetAspect: number // 16/9
): CropRegion {
  // 1. If faces found → center crop on face centroid
  // 2. Apply rule-of-thirds positioning
  // 3. Ensure minimum padding around faces
  // 4. Fallback: center crop
}
```

---

### Step 3: AI Text Generation

#### Gemini API Integration

```typescript
interface LoveStoryInput {
  groomName: string;
  brideName: string;
  weddingDate: string;
  howWeMet?: string;    // Optional user story seed
  style: 'romantic' | 'cinematic' | 'playful' | 'traditional';
  language: 'vi' | 'en';
}

interface LoveStoryOutput {
  title: string;        // "Minh & Hoa"
  subtitle: string;     // "A Love Story"
  dateFormatted: string; // "25 Tháng 12, 2026"
  loveStory: string;    // 2-3 sentences
  poem: string;         // 4-line poem
  closing: string;      // "Trân trọng kính mời"
  hashtag: string;      // "#MinhHoa2026"
}

// Prompt Template:
const LOVE_STORY_PROMPT = `
Bạn là một nhà thơ lãng mạn. Hãy viết nội dung cho thiệp cưới/video cưới:
- Tên chú rể: {groomName}
- Tên cô dâu: {brideName}
- Ngày cưới: {weddingDate}
- Câu chuyện: {howWeMet}
- Phong cách: {style}

Trả về JSON với format: { title, subtitle, dateFormatted, loveStory, poem, closing, hashtag }
Viết bằng tiếng Việt, giọng văn {style}, tối đa 50 từ cho loveStory.
`;

// Cost: ~$0.001 per generation (Gemini Flash)
```

---

### Step 4: FFmpeg Compositing Engine

#### Video Template Presets

```typescript
interface VideoTemplate {
  id: string;
  name: string;
  description: string;
  
  // Timing
  photoDuration: number;  // seconds per photo (default: 4)
  transitionDuration: number; // seconds (default: 1)
  introSequence: IntroConfig;
  outroSequence: OutroConfig;
  
  // Visual
  kenBurns: KenBurnsConfig;
  transitions: TransitionType[];
  textStyle: TextStyleConfig;
  colorGrading: ColorGradingConfig;
  
  // Audio
  fadeInDuration: number;
  fadeOutDuration: number;
}

type TransitionType = 
  | 'crossfade'    // Mờ dần
  | 'slideright'   // Trượt phải
  | 'slideleft'    // Trượt trái
  | 'zoomin'       // Zoom vào
  | 'wipeleft'     // Quét trái
  | 'circleopen'   // Mở vòng tròn
  | 'fade';        // Fade đen

interface KenBurnsConfig {
  zoomRange: [number, number];  // [1.0, 1.3] = 0-30% zoom
  panRange: [number, number];   // [-0.1, 0.1] = 10% max pan
  easing: 'linear' | 'ease-in-out';
}
```

#### 5 Launch Presets

| Preset | Description | Ken Burns | Transitions | Text Style | Mood |
|--------|-------------|-----------|-------------|------------|------|
| **Cinematic** | Film-like, dramatic | Slow zoom + pan | Crossfade | Serif, gold | Dramatic |
| **Romantic** | Soft, dreamy | Gentle zoom | Fade, dissolve | Script font, pink | Tender |
| **Modern** | Clean, minimal | Static/subtle | Slide, wipe | Sans-serif, white | Chic |
| **Vintage** | Film grain, warm | Slow pan | Crossfade | Typewriter | Nostalgic |
| **Traditional VN** | Red & gold, festive | Subtle zoom | Circle open | Bold serif, red | Festive |

#### FFmpeg Command Builder

```typescript
class FFmpegCommandBuilder {
  private inputs: string[] = [];
  private filterGraph: string[] = [];
  
  // Build Ken Burns effect for each photo
  addKenBurns(photoPath: string, duration: number, config: KenBurnsConfig): this {
    // zoompan filter: zoom from 1.0 to 1.3 over duration
    // z='min(zoom+0.001,1.3)':d={duration*25}:s=1920x1080
    const filter = `zoompan=z='min(zoom+${config.zoomRange[0]/1000},${config.zoomRange[1]})':` +
      `d=${duration * 25}:s=1920x1080:fps=25`;
    this.filterGraph.push(filter);
    return this;
  }
  
  // Add transition between segments
  addTransition(type: TransitionType, duration: number): this {
    // xfade filter: xfade=transition=crossfade:duration=1:offset=3
    const filter = `xfade=transition=${type}:duration=${duration}:offset=${this.currentOffset}`;
    this.filterGraph.push(filter);
    return this;
  }
  
  // Add text overlay
  addTextOverlay(text: string, config: TextStyleConfig): this {
    // drawtext filter with fade-in/fade-out
    const filter = `drawtext=text='${text}':fontfile=${config.fontPath}:` +
      `fontsize=${config.fontSize}:fontcolor=${config.color}:` +
      `x=(w-text_w)/2:y=${config.yPosition}:` +
      `enable='between(t,${config.startTime},${config.endTime})'`;
    this.filterGraph.push(filter);
    return this;
  }
  
  // Mix audio
  addAudioTrack(musicPath: string, fadeIn: number, fadeOut: number): this {
    const filter = `afade=t=in:d=${fadeIn},afade=t=out:st=${this.totalDuration - fadeOut}:d=${fadeOut}`;
    this.filterGraph.push(filter);
    return this;
  }
  
  // Build final command
  build(): string {
    return `ffmpeg ${this.inputs.join(' ')} ` +
      `-filter_complex "${this.filterGraph.join(';')}" ` +
      `-c:v libx264 -preset ${this.preset} -crf ${this.crf} ` +
      `-c:a aac -b:a 192k -ar 44100 ` +
      `-movflags +faststart output.mp4`;
  }
}
```

---

### Step 5: Post-Processing

#### Watermark (Free Tier)

```typescript
function addWatermark(videoPath: string, outputPath: string): string {
  return `ffmpeg -i ${videoPath} ` +
    `-vf "drawtext=text='lovestory.app':fontsize=24:fontcolor=white@0.5:` +
    `x=w-tw-20:y=h-th-20:enable='between(t,0,999)'" ` +
    `-c:a copy ${outputPath}`;
}
```

#### Encoding Profiles

| Profile | Resolution | CRF | Preset | Bitrate (approx) | Use Case |
|---------|-----------|-----|--------|-------------------|----------|
| Preview | 720p | 28 | veryfast | ~1 Mbps | Quick preview |
| Standard | 1080p | 22 | medium | ~4 Mbps | Pro tier output |
| Premium | 4K | 20 | slow | ~12 Mbps | Premium tier |
| Thumbnail | 640x360 | - | - | JPEG q85 | Video thumbnail |

---

## 3. Job Queue Architecture (BullMQ)

```typescript
// Queue definition
const videoQueue = new Queue('video-render', {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 5000 },
    removeOnComplete: { age: 86400 }, // 24h
    removeOnFail: { age: 604800 },    // 7 days
  },
});

// Job data
interface VideoRenderJob {
  videoId: string;
  tenantId: string;
  photos: string[];         // R2 URLs
  musicUrl: string;
  templatePreset: string;
  coupleInfo: {
    groomName: string;
    brideName: string;
    weddingDate: string;
    howWeMet?: string;
  };
  resolution: '720p' | '1080p' | '4k';
  addWatermark: boolean;
}

// Worker
const worker = new Worker('video-render', async (job) => {
  const { data } = job;
  
  // Step 1: Download photos from R2
  await job.updateProgress(10);
  const photos = await downloadPhotos(data.photos);
  
  // Step 2: Preprocess (resize, orient)
  await job.updateProgress(20);
  const processed = await preprocessPhotos(photos);
  
  // Step 3: AI enhancements
  await job.updateProgress(30);
  const enhanced = await aiEnhance(processed);
  
  // Step 4: AI text generation
  await job.updateProgress(40);
  const textContent = await generateLoveStory(data.coupleInfo);
  
  // Step 5: FFmpeg compositing
  await job.updateProgress(50);
  const rawVideo = await renderVideo(enhanced, data.templatePreset, textContent, data.musicUrl);
  
  // Step 6: Post-processing (watermark, encode)
  await job.updateProgress(80);
  const finalVideo = await postProcess(rawVideo, data.resolution, data.addWatermark);
  
  // Step 7: Upload to R2
  await job.updateProgress(90);
  const urls = await uploadToR2(finalVideo, data.videoId);
  
  // Step 8: Webhook callback
  await job.updateProgress(100);
  await webhookComplete(data.videoId, urls);
  
  return urls;
}, { connection: redis, concurrency: 2 });
```

---

## 4. Performance Targets

| Metric | Target | Strategy |
|--------|--------|----------|
| 30s video render (1080p) | < 60s | FFmpeg preset: medium, parallel photo processing |
| 60s video render (1080p) | < 120s | Photo preprocessing in parallel |
| 4K video render | < 300s | Premium queue with higher priority |
| AI text generation | < 3s | Gemini Flash model |
| Background removal | < 5s/photo | GPU-accelerated rembg (optional) |
| Face detection | < 1s/photo | TinyFaceDetector (fast model) |

---

## 5. Cost Analysis

| Component | Cost per Video | Monthly (1000 videos) |
|-----------|---------------|----------------------|
| FFmpeg compute (Fly.io) | ~$0.02 | ~$20 |
| Gemini API (text gen) | ~$0.001 | ~$1 |
| rembg (BG removal) | ~$0.005 | ~$5 |
| R2 storage (300MB/video) | ~$0.005 | ~$5 |
| R2 egress | $0.00 | $0 |
| **Total** | **~$0.03** | **~$31** |

**Margin Analysis:**
- Credit pack: 49K VND / 10 videos = 4,900 VND/video (~$0.19)
- Cost per video: ~$0.03
- **Gross margin: ~84%** ✅

---

## 6. Error Handling & Retry Strategy

```typescript
// Error types and handling
enum PipelineError {
  INVALID_INPUT = 'INVALID_INPUT',     // Bad file → reject immediately
  AI_SERVICE_DOWN = 'AI_SERVICE_DOWN', // Gemini/rembg down → retry 3x
  FFMPEG_CRASH = 'FFMPEG_CRASH',       // FFmpeg error → retry with simpler preset
  STORAGE_ERROR = 'STORAGE_ERROR',     // R2 upload fail → retry 3x
  TIMEOUT = 'TIMEOUT',                 // Render too long → kill + notify user
}

// Retry strategy
const retryConfig = {
  INVALID_INPUT: { retries: 0, action: 'reject' },
  AI_SERVICE_DOWN: { retries: 3, backoff: 'exponential', fallback: 'skip_ai' },
  FFMPEG_CRASH: { retries: 2, backoff: 'fixed', fallback: 'simpler_preset' },
  STORAGE_ERROR: { retries: 3, backoff: 'exponential' },
  TIMEOUT: { retries: 1, action: 'reduce_quality' },
};
```

---

## 7. Future Enhancements (Phase 3+)

| Feature | Technology | Complexity |
|---------|-----------|-----------|
| AI Video Generation (Runway/Kling) | REST API integration | High |
| Beat-synced transitions | Essentia.js BPM detection | Medium |
| AI music generation | Suno API / MusicGen | High |
| Real-time preview | WebGL + Canvas rendering | Very High |
| Multi-scene templates | FFmpeg complex filter chains | Medium |
| Green screen compositing | Chroma key + AI matte | Medium |
