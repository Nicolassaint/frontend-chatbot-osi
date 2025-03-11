import Header from '@/components/Header';
import Description from '@/components/Description';
import CurriculumVitae from '@/components/CurriculumVitae';
import VideoPlayer from '@/components/VideoPlayer';
import ChatInterface from '@/components/chatbot/ChatInterface';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen relative">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6 max-w-5xl">
        <Description />
        <CurriculumVitae />
        <div className="relative z-0">
          <VideoPlayer />
        </div>
      </main>
      <div className="z-50">
        <ChatInterface />
      </div>
    </div>
  );
}
