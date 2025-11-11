import Image from 'next/image'

export default function ProfileCard() {
  return (
    <div className="bg-gray-800 rounded-2xl shadow-xl p-6 max-w-md w-full border border-gray-700">
      <div className="flex items-start space-x-4">
        <Image 
          src="https://images-ext-1.discordapp.net/external/KrIqWUAOKPLl891pmbqYPMDP4JYgF9pW21lxBGNPBRk/%3Fsize%3D4096/https/cdn.discordapp.com/avatars/1352995832164520029/f3f14fbdc756bc9d3cb1767fb8d73b0a.png?format=webp&quality=lossless" 
          alt="Profile" 
          width={64}
          height={64}
          className="rounded-full border-2 border-purple-500"
        />
        <h1 className="text-2xl font-bold text-white mt-4">nathan</h1>
      </div>
      
      <div className="mt-6 flex justify-center">
        <a 
          href="https://kittys.rip/users/57/profile" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-block"
        >
          <Image 
            src="https://images-ext-1.discordapp.net/external/IOBntUobQWTQfVPxPegm5d0_yOEnLTK-cuZhNokwgdE/%3Fsize%3D1024/https/cdn.discordapp.com/icons/1434524326635503785/a_be7f4b2ee87b2496ccf7ef2a680d015a.gif?format=webp&quality=lossless" 
            alt="Logo" 
            width={40}
            height={40}
            className="rounded-lg"
          />
        </a>
      </div>
    </div>
  )
}
