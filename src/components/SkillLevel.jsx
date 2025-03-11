export default function SkillLevel({ level }) {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <div 
          key={i} 
          className={`w-4 h-4 rounded-full skill-dot ${
            i < level ? 'turquoise-bg' : 'bg-gray-300 dark:bg-gray-700'
          }`}
        />
      ))}
    </div>
  );
} 