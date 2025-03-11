import Image from 'next/image';
// import SkillLevel from './SkillLevel';

export default function CurriculumVitae() {
  const skills = [
    { name: "Visioconférence", level: 4 },
    { name: "Copieurs", level: 4 },
    { name: "Réseaux Wifi de Bercy", level: 4 },
    { name: "Télétravail et outils collaboratifs", level: 3 },
    { name: "Applications et logiciels", level: 2 },
  ];

  return (
    <section className="mb-8 slide-in">
      <h2 className="text-lg font-semibold mb-4 text-coral-bg">Son curriculum vitae (en évolution constante) :</h2>
      
      {/* Option 1: Utiliser l'image directement */}
      <div className="hidden md:block">
        <div className="relative w-full h-[200px]">
          <Image 
            src="/OSI - CV Transparent.png" 
            alt="Curriculum vitae OSI" 
            fill
            className="object-contain"
          />
        </div>
      </div>
      
      {/* Option 2: Version responsive pour mobile
      <div className="md:hidden space-y-3">
        {skills.map((skill, index) => (
          <div key={index} className="flex justify-between items-center p-2 bg-white shadow-sm rounded-lg hover:shadow-md transition-shadow">
            <span className="text-base">{skill.name}</span>
            <SkillLevel level={skill.level} />
          </div>
        ))}
      </div> */}
    </section>
  );
} 