"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface EngineCompatibilityProps {
  modelFormats: string[];
}

export default function EngineCompatibility({ modelFormats }: EngineCompatibilityProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedEngine, setSelectedEngine] = useState<string | null>(null);

  const engines = [
    {
      id: 'unity',
      name: 'Unity',
      icon: '🎮',
      color: 'from-gray-700 to-gray-900',
      borderColor: 'border-gray-500',
      compatibility: 100,
      formats: ['fbx', 'obj', 'glb'],
      notes: 'Fully compatible. Drag & drop into Assets folder.',
      importCode: `// Unity C# Import
using UnityEngine;

public class ModelLoader : MonoBehaviour
{
    void Start()
    {
        // Model auto-imported in Assets/
        GameObject model = Resources.Load<GameObject>("CyberpunkMech");
        Instantiate(model, Vector3.zero, Quaternion.identity);
    }
}`,
    },
    {
      id: 'unreal',
      name: 'Unreal Engine',
      icon: '🎯',
      color: 'from-blue-600 to-blue-900',
      borderColor: 'border-blue-500',
      compatibility: 100,
      formats: ['fbx', 'obj'],
      notes: 'Perfect compatibility. Import via Content Browser.',
      importCode: `// Unreal C++ Import
#include "Engine/StaticMesh.h"

void AMyActor::LoadModel()
{
    UStaticMesh* Mesh = LoadObject<UStaticMesh>(
        nullptr,
        TEXT("/Game/Models/CyberpunkMech")
    );
    StaticMeshComponent->SetStaticMesh(Mesh);
}`,
    },
    {
      id: 'godot',
      name: 'Godot',
      icon: '🤖',
      color: 'from-cyan-600 to-blue-700',
      borderColor: 'border-cyan-500',
      compatibility: 95,
      formats: ['glb', 'gltf', 'obj'],
      notes: 'Excellent support. GLB recommended for best results.',
      importCode: `# Godot GDScript Import
extends Node3D

func _ready():
    var scene = load("res://models/cyberpunk_mech.glb")
    var instance = scene.instantiate()
    add_child(instance)`,
    },
    {
      id: 'blender',
      name: 'Blender',
      icon: '🎨',
      color: 'from-orange-600 to-orange-900',
      borderColor: 'border-orange-500',
      compatibility: 100,
      formats: ['fbx', 'obj', 'glb', 'blend'],
      notes: 'Native support. All features preserved.',
      importCode: `# Blender Python Import
import bpy

# Import FBX
bpy.ops.import_scene.fbx(
    filepath="/path/to/model.fbx"
)

# Or import GLB
bpy.ops.import_scene.gltf(
    filepath="/path/to/model.glb"
)`,
    },
    {
      id: 'threejs',
      name: 'Three.js',
      icon: '🌐',
      color: 'from-green-600 to-green-900',
      borderColor: 'border-green-500',
      compatibility: 100,
      formats: ['glb', 'gltf'],
      notes: 'Perfect for web. GLB format recommended.',
      importCode: `// Three.js JavaScript Import
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const loader = new GLTFLoader();
loader.load('/models/cyberpunk_mech.glb', (gltf) => {
    scene.add(gltf.scene);
    
    // Play animations
    const mixer = new THREE.AnimationMixer(gltf.scene);
    gltf.animations.forEach((clip) => {
        mixer.clipAction(clip).play();
    });
});`,
    },
    {
      id: 'babylonjs',
      name: 'Babylon.js',
      icon: '🏛️',
      color: 'from-red-600 to-red-900',
      borderColor: 'border-red-500',
      compatibility: 100,
      formats: ['glb', 'gltf', 'obj'],
      notes: 'Excellent web support. Full PBR materials.',
      importCode: `// Babylon.js JavaScript Import
BABYLON.SceneLoader.ImportMesh(
    "",
    "/models/",
    "cyberpunk_mech.glb",
    scene,
    (meshes) => {
        // Model loaded
        meshes[0].position = new BABYLON.Vector3(0, 0, 0);
    }
);`,
    },
  ];

  const handleEngineSelect = (engineId: string) => {
    setSelectedEngine(engineId);
    
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('showNotification', {
        detail: {
          type: 'info',
          title: `${engines.find(e => e.id === engineId)?.name} Preview`,
          message: 'Viewing engine-specific compatibility and import code',
          autoClose: 2000,
        }
      }));
    }
  };

  const copyCode = (code: string, engineName: string) => {
    navigator.clipboard.writeText(code);
    
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('showNotification', {
        detail: {
          type: 'success',
          title: 'Code Copied!',
          message: `${engineName} import code copied to clipboard`,
          autoClose: 2000,
        }
      }));
    }
  };

  const selectedEngineData = engines.find(e => e.id === selectedEngine);

  return (
    <div className="bg-slate-800/50 border border-orange-500/20 rounded-xl p-4 backdrop-blur">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between mb-3"
      >
        <div className="flex items-center gap-2">
          <span className="text-xl">🎮</span>
          <span className="text-sm font-semibold text-white">Engine Compatibility</span>
        </div>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          className="text-gray-400"
        >
          ▼
        </motion.span>
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-4"
        >
          {/* Engine Grid */}
          <div>
            <label className="text-xs text-gray-400 mb-2 block">Select Engine</label>
            <div className="grid grid-cols-2 gap-2">
              {engines.map((engine) => (
                <button
                  key={engine.id}
                  onClick={() => handleEngineSelect(engine.id)}
                  className={`p-3 rounded-lg transition border-2 ${
                    selectedEngine === engine.id
                      ? `bg-gradient-to-br ${engine.color} ${engine.borderColor} shadow-lg`
                      : "bg-slate-700 border-slate-600 hover:border-slate-500"
                  }`}
                >
                  <div className="text-3xl mb-1">{engine.icon}</div>
                  <div className="text-xs font-semibold text-white">{engine.name}</div>
                  <div className="text-xs text-gray-400">{engine.compatibility}%</div>
                </button>
              ))}
            </div>
          </div>

          {/* Selected Engine Details */}
          {selectedEngineData && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              {/* Engine Header */}
              <div className={`bg-gradient-to-br ${selectedEngineData.color} border-2 ${selectedEngineData.borderColor} rounded-xl p-4`}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-4xl">{selectedEngineData.icon}</span>
                  <div>
                    <h4 className="text-white font-bold text-lg">{selectedEngineData.name}</h4>
                    <p className="text-xs text-gray-300">{selectedEngineData.notes}</p>
                  </div>
                </div>
                
                {/* Compatibility Bar */}
                <div className="mb-2">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-300">Compatibility</span>
                    <span className="text-white font-bold">{selectedEngineData.compatibility}%</span>
                  </div>
                  <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${selectedEngineData.compatibility}%` }}
                      className="h-full bg-gradient-to-r from-green-400 to-emerald-500"
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>

                {/* Supported Formats */}
                <div className="flex flex-wrap gap-2">
                  {selectedEngineData.formats.map((format) => (
                    <span
                      key={format}
                      className={`px-2 py-1 rounded text-xs font-mono font-bold ${
                        modelFormats.includes(format)
                          ? "bg-green-500/20 text-green-300 border border-green-500/50"
                          : "bg-gray-500/20 text-gray-400 border border-gray-500/50"
                      }`}
                    >
                      .{format}
                    </span>
                  ))}
                </div>
              </div>

              {/* Import Code */}
              <div className="bg-slate-900 border border-slate-700 rounded-lg overflow-hidden">
                <div className="flex items-center justify-between px-3 py-2 bg-slate-800 border-b border-slate-700">
                  <span className="text-xs text-gray-400 font-semibold">Import Code</span>
                  <button
                    onClick={() => copyCode(selectedEngineData.importCode, selectedEngineData.name)}
                    className="text-xs text-orange-400 hover:text-orange-300 transition"
                  >
                    📋 Copy
                  </button>
                </div>
                <pre className="p-3 text-xs text-gray-300 overflow-x-auto">
                  <code>{selectedEngineData.importCode}</code>
                </pre>
              </div>

              {/* Quick Tips */}
              <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-lg p-3">
                <div className="text-xs text-blue-300 mb-2 font-semibold">
                  💡 Quick Tips for {selectedEngineData.name}
                </div>
                <div className="text-xs text-gray-400 space-y-1">
                  {selectedEngineData.id === 'unity' && (
                    <>
                      <div>• Place in Assets/Models/ folder</div>
                      <div>• FBX preserves animations best</div>
                      <div>• Check "Import Materials" in inspector</div>
                    </>
                  )}
                  {selectedEngineData.id === 'unreal' && (
                    <>
                      <div>• Import via Content Browser</div>
                      <div>• Enable "Import Textures" option</div>
                      <div>• Use FBX for skeletal meshes</div>
                    </>
                  )}
                  {selectedEngineData.id === 'godot' && (
                    <>
                      <div>• GLB format recommended</div>
                      <div>• Place in res://models/ folder</div>
                      <div>• Animations auto-imported</div>
                    </>
                  )}
                  {selectedEngineData.id === 'blender' && (
                    <>
                      <div>• File → Import → FBX/GLB</div>
                      <div>• All features fully supported</div>
                      <div>• Perfect for further editing</div>
                    </>
                  )}
                  {selectedEngineData.id === 'threejs' && (
                    <>
                      <div>• Use GLTFLoader from examples</div>
                      <div>• Animations in gltf.animations</div>
                      <div>• Perfect for web deployment</div>
                    </>
                  )}
                  {selectedEngineData.id === 'babylonjs' && (
                    <>
                      <div>• SceneLoader.ImportMesh()</div>
                      <div>• Full PBR material support</div>
                      <div>• Excellent performance</div>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Overall Compatibility */}
          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-lg p-3">
            <div className="text-xs text-green-300 mb-2 font-semibold">
              ✅ Universal Compatibility
            </div>
            <div className="text-xs text-gray-400">
              This model works with all major game engines and 3D software. Download includes multiple formats for maximum compatibility.
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
