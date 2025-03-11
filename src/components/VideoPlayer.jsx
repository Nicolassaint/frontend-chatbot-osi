export default function VideoPlayer() {
  return (
    <section className="mb-8">
      <h2 className="text-lg font-semibold mb-4">Vidéo de présentation :</h2>
      <div className="relative aspect-video w-full max-w-2xl mx-auto border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
        <iframe 
          src="https://video.finances.gouv.fr/watch/player/player/pubkey/869dab0bccbd0911be19/id/b5d0dc26afa81f346763797262f99a/viewcode/default?onload=PlayerLoaded"
          className="absolute top-0 left-0 w-full h-full"
          title="Vidéo de présentation OSI"
          allowFullScreen
        />
      </div>
    </section>
  );
} 