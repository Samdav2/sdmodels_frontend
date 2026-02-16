"use client";

import Link from "next/link";

interface Model {
  qualityChecks: {
    nonManifold: boolean;
    overlappingUVs: boolean;
    realWorldScale: boolean;
    cleanTopology: boolean;
    properNormals: boolean;
  };
  textureSets: string[];
  relatedAssets: Array<{
    id: string;
    name: string;
    price: number;
    thumbnail: string;
  }>;
  description: string;
}

interface TechnicalDeepDiveProps {
  model: Model;
}

export default function TechnicalDeepDive({ model }: TechnicalDeepDiveProps) {
  return (
    <div className="bg-slate-900/80 border-t border-orange-500/20">
      <div className="max-w-[2000px] mx-auto px-6 py-16 space-y-16">
        
        {/* Description */}
        <div>
          <h2 className="text-3xl font-black text-white mb-4">About This Asset</h2>
          <p className="text-gray-300 text-lg leading-relaxed max-w-4xl">
            {model.description}
          </p>
        </div>

        {/* Model Health Report */}
        <div>
          <h2 className="text-3xl font-black text-white mb-6">
            ✅ Model Health Report
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <QualityCheck 
              label="Non-manifold Geometry"
              status={model.qualityChecks.nonManifold}
              description="All edges properly connected"
            />
            <QualityCheck 
              label="Overlapping UVs"
              status={model.qualityChecks.overlappingUVs}
              description="Clean UV layout verified"
            />
            <QualityCheck 
              label="Real-world Scale"
              status={model.qualityChecks.realWorldScale}
              description="Proper unit scaling applied"
            />
            <QualityCheck 
              label="Clean Topology"
              status={model.qualityChecks.cleanTopology}
              description="Optimized mesh structure"
            />
            <QualityCheck 
              label="Proper Normals"
              status={model.qualityChecks.properNormals}
              description="All normals facing correctly"
            />
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-2 border-green-500/30 rounded-xl p-6 backdrop-blur">
              <div className="text-4xl mb-2">🏆</div>
              <div className="text-lg font-bold text-white mb-1">Quality Certified</div>
              <div className="text-sm text-gray-400">Passed all automated checks</div>
            </div>
          </div>
        </div>

        {/* Texture Gallery */}
        <div>
          <h2 className="text-3xl font-black text-white mb-6">
            🎨 Texture Gallery
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {model.textureSets.map((texture, index) => {
              // Generate unique colors for each texture type
              const colors = [
                'from-red-500 to-orange-500',
                'from-blue-500 to-cyan-500',
                'from-purple-500 to-pink-500',
                'from-green-500 to-emerald-500',
                'from-yellow-500 to-amber-500',
              ];
              const colorClass = colors[index % colors.length];
              
              return (
                <div 
                  key={texture}
                  className="group bg-slate-800/50 border border-orange-500/20 rounded-xl overflow-hidden hover:border-orange-500/50 transition cursor-pointer"
                >
                  <div className={`aspect-square bg-gradient-to-br ${colorClass} flex items-center justify-center relative overflow-hidden`}>
                    {/* Texture pattern overlay */}
                    <div className="absolute inset-0 opacity-30" style={{
                      backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)`
                    }}></div>
                    <span className="text-4xl relative z-10 group-hover:scale-110 transition">
                      {texture.includes('Diffuse') ? '🎨' : 
                       texture.includes('Normal') ? '🗺️' :
                       texture.includes('Roughness') ? '✨' :
                       texture.includes('Metallic') ? '💎' : '🖼️'}
                    </span>
                  </div>
                  <div className="p-3">
                    <div className="text-sm font-semibold text-white">{texture}</div>
                    <div className="text-xs text-gray-400">4096 x 4096</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Related Assets */}
        <div>
          <h2 className="text-3xl font-black text-white mb-6">
            🔗 Frequently Bought Together
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {model.relatedAssets.map((asset) => (
              <Link 
                key={asset.id}
                href={`/model/${asset.id}`}
                className="group bg-slate-800/50 border border-orange-500/20 rounded-xl overflow-hidden hover:border-orange-500/50 hover:scale-105 transition"
              >
                <div className="aspect-video bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
                  <span className="text-5xl opacity-50 group-hover:opacity-100 transition">🎮</span>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-white mb-2 group-hover:text-orange-400 transition">
                    {asset.name}
                  </h3>
                  <div className="text-2xl font-black bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                    ${asset.price}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Technical Specifications Table */}
        <div>
          <h2 className="text-3xl font-black text-white mb-6">
            📋 Full Specifications
          </h2>
          <div className="bg-slate-800/50 border border-orange-500/20 rounded-xl overflow-hidden">
            <table className="w-full">
              <tbody className="divide-y divide-orange-500/10">
                <SpecRow label="File Formats" value="GLB, FBX, OBJ, BLEND" />
                <SpecRow label="Texture Resolution" value="4K (4096x4096)" />
                <SpecRow label="Texture Maps" value="Diffuse, Normal, Roughness, Metallic, AO" />
                <SpecRow label="Polygon Count" value="45,200 Triangles" />
                <SpecRow label="Rigging" value="Yes - Full Body Rig" />
                <SpecRow label="Animation Clips" value="6 (Idle, Walk, Run, Jump, Attack, Death)" />
                <SpecRow label="UV Mapping" value="Non-overlapping, Optimized" />
                <SpecRow label="Materials" value="PBR Standard" />
                <SpecRow label="License" value="Commercial Use Allowed" />
                <SpecRow label="File Size" value="~85 MB (All formats)" />
              </tbody>
            </table>
          </div>
        </div>

        {/* Support & Updates */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-xl p-8">
            <div className="text-4xl mb-4">💬</div>
            <h3 className="text-2xl font-bold text-white mb-2">Need Help?</h3>
            <p className="text-gray-300 mb-4">
              Our support team is here to assist with any questions about this asset.
            </p>
            <button 
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.dispatchEvent(new CustomEvent('showNotification', {
                    detail: {
                      type: 'info',
                      title: 'Contact Support',
                      message: 'Opening support chat... Our team will respond within 24 hours.',
                      autoClose: 3000,
                    }
                  }));
                }
              }}
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition"
            >
              Contact Support
            </button>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-8">
            <div className="text-4xl mb-4">🔔</div>
            <h3 className="text-2xl font-bold text-white mb-2">Get Updates</h3>
            <p className="text-gray-300 mb-4">
              Follow this asset to receive notifications about updates and new versions.
            </p>
            <button 
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.dispatchEvent(new CustomEvent('showNotification', {
                    detail: {
                      type: 'success',
                      title: 'Following Asset',
                      message: 'You will receive notifications about updates and new versions!',
                      autoClose: 3000,
                    }
                  }));
                }
              }}
              className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold transition"
            >
              Follow Asset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function QualityCheck({ label, status, description }: { label: string; status: boolean; description: string }) {
  return (
    <div className={`border-2 rounded-xl p-6 backdrop-blur ${
      status 
        ? "bg-green-500/10 border-green-500/30" 
        : "bg-red-500/10 border-red-500/30"
    }`}>
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">{status ? "✅" : "❌"}</span>
        <div className="text-lg font-bold text-white">{label}</div>
      </div>
      <div className={`text-sm ${status ? "text-green-300" : "text-red-300"}`}>
        {status ? description : "Issues detected"}
      </div>
    </div>
  );
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <tr className="hover:bg-orange-500/5 transition">
      <td className="px-6 py-4 text-gray-400 font-semibold">{label}</td>
      <td className="px-6 py-4 text-white">{value}</td>
    </tr>
  );
}
