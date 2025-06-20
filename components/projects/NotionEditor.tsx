"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { 
  Type, 
  Heading, 
  List, 
  Image as ImageIcon, 
  Plus,
  Trash2,
  GripVertical,
  Save,
  FileText,
  CheckSquare,
  Quote,
  Code,
  Calendar,
  Users,
  DollarSign,
  Clock,
  Target,
  Palette,
  Settings,
  ArrowLeft,
  Home,
  FolderOpen,
  LayoutDashboard,
  Minus
} from "lucide-react";

interface Block {
  id: string;
  type: 'heading1' | 'heading2' | 'heading3' | 'paragraph' | 'bullet' | 'checklist' | 'quote' | 'code' | 'image' | 'divider';
  content: string;
  checked?: boolean; // for checklist items
}

interface ProjectMetadata {
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'planning' | 'in-progress' | 'review' | 'completed';
  startDate: string;
  endDate: string;
  budget: string;
  teamMembers: string[];
}

interface NotionEditorProps {
  onSave?: (projectData: any) => void;
  onBack?: () => void;
}

export const NotionEditor = ({ onSave, onBack }: NotionEditorProps) => {
  const [projectTitle, setProjectTitle] = useState("");
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
  const [showBlockMenu, setShowBlockMenu] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<ProjectMetadata>({
    priority: 'medium',
    status: 'planning',
    startDate: '',
    endDate: '',
    budget: '',
    teamMembers: []
  });

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const blockTypes = [
    { type: 'heading1', icon: Heading, title: 'Heading 1' },
    { type: 'heading2', icon: Heading, title: 'Heading 2' },
    { type: 'heading3', icon: Heading, title: 'Heading 3' },
    { type: 'paragraph', icon: Type, title: 'Text' },
    { type: 'bullet', icon: List, title: 'Bullet List' },
    { type: 'checklist', icon: CheckSquare, title: 'To-do' },
    { type: 'quote', icon: Quote, title: 'Quote' },
    { type: 'code', icon: Code, title: 'Code' },
    { type: 'image', icon: ImageIcon, title: 'Image' },
    { type: 'divider', icon: Minus, title: 'Divider' },
  ];

  const addBlock = (afterIndex: number = -1, type: Block['type'], replaceBlock: boolean = false, blockId?: string) => {
    const newBlock: Block = {
      id: generateId(),
      type,
      content: '',
      checked: type === 'checklist' ? false : undefined
    };
    
    const newBlocks = [...blocks];
    
    if (replaceBlock && blockId) {
      // Replace the current block
      const blockIndex = newBlocks.findIndex(b => b.id === blockId);
      if (blockIndex !== -1) {
        newBlocks[blockIndex] = newBlock;
      }
    } else if (afterIndex === -1) {
      // Add to end
      newBlocks.push(newBlock);
    } else {
      // Add after specific index
      newBlocks.splice(afterIndex + 1, 0, newBlock);
    }
    
    setBlocks(newBlocks);
    setActiveBlockId(newBlock.id);
    setShowBlockMenu(null);
    
    // Focus the new block after a brief delay
    setTimeout(() => {
      const newBlockElement = document.querySelector(`[data-block-id="${newBlock.id}"] input, [data-block-id="${newBlock.id}"] textarea`);
      if (newBlockElement) {
        (newBlockElement as HTMLElement).focus();
      }
    }, 100);
  };

  const updateBlock = (id: string, content: string) => {
    setBlocks(blocks.map(block => 
      block.id === id ? { ...block, content } : block
    ));
  };

  const toggleCheckbox = (id: string) => {
    setBlocks(blocks.map(block => 
      block.id === id ? { ...block, checked: !block.checked } : block
    ));
  };

  const deleteBlock = (id: string) => {
    if (blocks.length > 0) {
      setBlocks(blocks.filter(block => block.id !== id));
      setActiveBlockId(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, blockId: string, blockIndex: number) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      addBlock(blockIndex, 'paragraph');
    } else if (e.key === 'Backspace') {
      const block = blocks.find(b => b.id === blockId);
      if (block?.content === '') {
        e.preventDefault();
        deleteBlock(blockId);
        if (blockIndex > 0) {
          setActiveBlockId(blocks[blockIndex - 1].id);
          // Focus the previous block
          setTimeout(() => {
            const prevBlockElement = document.querySelector(`[data-block-id="${blocks[blockIndex - 1].id}"] input, [data-block-id="${blocks[blockIndex - 1].id}"] textarea`);
            if (prevBlockElement) {
              (prevBlockElement as HTMLElement).focus();
            }
          }, 50);
        }
      }
    } else if (e.key === '/' && (e.target as HTMLInputElement | HTMLTextAreaElement).value === '') {
      e.preventDefault();
      setShowBlockMenu(`inline-${blockId}`);
    }
  };

  const handleSave = () => {
    if (!projectTitle.trim()) {
      alert('Please enter a project title');
      return;
    }

    const projectData = {
      title: projectTitle,
      blocks: blocks,
      metadata: metadata,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    if (onSave) {
      onSave(projectData);
    }
    
    console.log('Project saved:', projectData);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.block-menu') && !target.closest('.menu-trigger')) {
        setShowBlockMenu(null);
      }
    };

    if (showBlockMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showBlockMenu]);

  // Compact Block Type Menu - horizontal icon bar
  const BlockTypeMenu = ({ afterIndex, position = 'bottom', isInline = false, blockId, currentBlockIndex }: { afterIndex: number; position?: 'bottom' | 'top'; isInline?: boolean; blockId?: string; currentBlockIndex?: number }) => (
    <div className={`block-menu absolute ${position === 'bottom' ? 'mt-4' : 'mb-4 bottom-full'} ${isInline ? 'left-0 right-0 mx-4' : 'left-0'} z-[70] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg shadow-xl ${isInline ? 'p-4' : 'p-2'}`}>
      {isInline && (
        <div className="text-sm text-slate-600 dark:text-slate-400 mb-3 font-medium">
          Add block after this one:
        </div>
      )}
      <div className={`${isInline ? 'grid grid-cols-5 gap-3' : 'flex items-center gap-1'}`}>
        {blockTypes.map((blockType) => (
          <Button
            key={blockType.type}
            variant="ghost"
            size="sm"
            className={`${isInline ? 'w-14 h-14 flex flex-col items-center gap-1 p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20' : 'w-10 h-10 p-0'} hover:bg-slate-100 dark:hover:bg-slate-700 flex-shrink-0 rounded-lg transition-colors`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('Creating block after index:', currentBlockIndex || afterIndex);
              addBlock(currentBlockIndex || afterIndex, blockType.type as Block['type']);
            }}
            title={blockType.title}
          >
            <blockType.icon className={`${isInline ? 'w-5 h-5' : 'w-4 h-4'} text-slate-600 dark:text-slate-400`} />
            {isInline && (
              <span className="text-xs text-slate-600 dark:text-slate-400 leading-none text-center">
                {blockType.title}
              </span>
            )}
          </Button>
        ))}
      </div>
    </div>
  );

  const autoResizeTextarea = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    target.style.height = 'auto';
    target.style.height = target.scrollHeight + 'px';
  };

  const renderBlock = (block: Block, index: number) => {
    const isActive = activeBlockId === block.id;
    const menuId = `block-${block.id}`;
    
    return (
      <div 
        key={block.id}
        data-block-id={block.id}
        className={`group relative transition-all duration-200 rounded-lg border-2 border-transparent ${
          isActive 
            ? 'bg-blue-50/50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700' 
            : 'hover:bg-slate-50/50 dark:hover:bg-slate-800/50 hover:border-slate-200 dark:hover:border-slate-700'
        }`}
      >
        {/* Block Controls */}
        <div className="absolute left-0 top-3 opacity-0 group-hover:opacity-100 transition-opacity -ml-12 flex items-center gap-1 z-10">
          <Button
            size="sm"
            variant="ghost"
            className="w-8 h-8 p-0 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md"
            title="Drag to reorder"
          >
            <GripVertical className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="w-8 h-8 p-0 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              deleteBlock(block.id);
            }}
            title="Delete block"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

        <div className="px-6 py-4 m-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700">
          {/* Block Content with improved padding */}
          {block.type === 'heading1' && (
            <div className="relative">
              <Input
                value={block.content}
                onChange={(e) => updateBlock(block.id, e.target.value)}
                placeholder="Heading 1"
                className="text-3xl font-bold border-none bg-transparent px-4 py-3 text-slate-900 dark:text-white focus:ring-0 focus:outline-none placeholder:text-slate-400 h-auto rounded-md hover:bg-slate-50 dark:hover:bg-slate-700"
                onKeyDown={(e) => handleKeyDown(e, block.id, index)}
                onFocus={() => setActiveBlockId(block.id)}
              />
              {isActive && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="menu-trigger absolute right-2 top-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 w-8 h-8 p-0 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowBlockMenu(showBlockMenu === `inline-${block.id}` ? null : `inline-${block.id}`);
                  }}
                  title="Add block"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              )}
            </div>
          )}

          {block.type === 'heading2' && (
            <div className="relative">
              <Input
                value={block.content}
                onChange={(e) => updateBlock(block.id, e.target.value)}
                placeholder="Heading 2"
                className="text-2xl font-bold border-none bg-transparent px-4 py-3 text-slate-900 dark:text-white focus:ring-0 focus:outline-none placeholder:text-slate-400 h-auto rounded-md hover:bg-slate-50 dark:hover:bg-slate-700"
                onKeyDown={(e) => handleKeyDown(e, block.id, index)}
                onFocus={() => setActiveBlockId(block.id)}
              />
              {isActive && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="menu-trigger absolute right-2 top-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 w-8 h-8 p-0 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowBlockMenu(showBlockMenu === `inline-${block.id}` ? null : `inline-${block.id}`);
                  }}
                  title="Add block"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              )}
            </div>
          )}

          {block.type === 'heading3' && (
            <div className="relative">
              <Input
                value={block.content}
                onChange={(e) => updateBlock(block.id, e.target.value)}
                placeholder="Heading 3"
                className="text-xl font-semibold border-none bg-transparent px-4 py-3 text-slate-900 dark:text-white focus:ring-0 focus:outline-none placeholder:text-slate-400 h-auto rounded-md hover:bg-slate-50 dark:hover:bg-slate-700"
                onKeyDown={(e) => handleKeyDown(e, block.id, index)}
                onFocus={() => setActiveBlockId(block.id)}
              />
              {isActive && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="menu-trigger absolute right-2 top-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 w-8 h-8 p-0 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowBlockMenu(showBlockMenu === `inline-${block.id}` ? null : `inline-${block.id}`);
                  }}
                  title="Add block"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              )}
            </div>
          )}

          {block.type === 'paragraph' && (
            <div className="relative">
              <Textarea
                value={block.content}
                onChange={(e) => updateBlock(block.id, e.target.value)}
                placeholder="Type '/' for commands, or start writing..."
                className="border-none bg-transparent px-4 py-3 text-slate-700 dark:text-slate-300 focus:ring-0 focus:outline-none resize-none min-h-[48px] leading-relaxed rounded-md hover:bg-slate-50 dark:hover:bg-slate-700"
                rows={1}
                onKeyDown={(e) => handleKeyDown(e, block.id, index)}
                onFocus={() => setActiveBlockId(block.id)}
                onInput={autoResizeTextarea}
              />
              {/* Inline Add Button */}
              {isActive && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="menu-trigger absolute right-2 top-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 w-8 h-8 p-0 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowBlockMenu(showBlockMenu === `inline-${block.id}` ? null : `inline-${block.id}`);
                  }}
                  title="Add block"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              )}
            </div>
          )}

          {block.type === 'bullet' && (
            <div className="flex items-start gap-4 px-4 py-3 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 relative">
              <span className="text-slate-400 mt-2 text-lg">•</span>
              <Textarea
                value={block.content}
                onChange={(e) => updateBlock(block.id, e.target.value)}
                placeholder="List item"
                className="border-none bg-transparent p-0 text-slate-700 dark:text-slate-300 focus:ring-0 focus:outline-none resize-none min-h-[32px] flex-1"
                rows={1}
                onKeyDown={(e) => handleKeyDown(e, block.id, index)}
                onFocus={() => setActiveBlockId(block.id)}
                onInput={autoResizeTextarea}
              />
              {isActive && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="menu-trigger absolute right-2 top-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 w-8 h-8 p-0 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowBlockMenu(showBlockMenu === `inline-${block.id}` ? null : `inline-${block.id}`);
                  }}
                  title="Add block"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              )}
            </div>
          )}

          {block.type === 'checklist' && (
            <div className="flex items-start gap-4 px-4 py-3 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 relative">
              <Button
                variant="ghost"
                size="sm"
                className={`w-5 h-5 p-0 mt-1 border rounded flex items-center justify-center ${
                  block.checked 
                    ? 'border-blue-600 bg-blue-600 text-white' 
                    : 'border-slate-300 dark:border-slate-600'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleCheckbox(block.id);
                }}
              >
                {block.checked && <CheckSquare className="w-3 h-3" />}
              </Button>
              <Textarea
                value={block.content}
                onChange={(e) => updateBlock(block.id, e.target.value)}
                placeholder="To-do item"
                className={`border-none bg-transparent p-0 focus:ring-0 focus:outline-none resize-none min-h-[32px] flex-1 ${
                  block.checked ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-300'
                }`}
                rows={1}
                onKeyDown={(e) => handleKeyDown(e, block.id, index)}
                onFocus={() => setActiveBlockId(block.id)}
                onInput={autoResizeTextarea}
              />
              {isActive && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="menu-trigger absolute right-2 top-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 w-8 h-8 p-0 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowBlockMenu(showBlockMenu === `inline-${block.id}` ? null : `inline-${block.id}`);
                  }}
                  title="Add block"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              )}
            </div>
          )}

          {block.type === 'quote' && (
            <div className="border-l-4 border-slate-300 pl-6 py-3 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 relative">
              <Textarea
                value={block.content}
                onChange={(e) => updateBlock(block.id, e.target.value)}
                placeholder="Quote"
                className="border-none bg-transparent p-0 text-slate-600 dark:text-slate-400 italic focus:ring-0 focus:outline-none resize-none min-h-[32px]"
                rows={1}
                onKeyDown={(e) => handleKeyDown(e, block.id, index)}
                onFocus={() => setActiveBlockId(block.id)}
                onInput={autoResizeTextarea}
              />
              {isActive && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="menu-trigger absolute right-2 top-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 w-8 h-8 p-0 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowBlockMenu(showBlockMenu === `inline-${block.id}` ? null : `inline-${block.id}`);
                  }}
                  title="Add block"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              )}
            </div>
          )}

          {block.type === 'code' && (
            <div className="bg-slate-100 dark:bg-slate-700 rounded-lg p-4 mx-2">
              <Textarea
                value={block.content}
                onChange={(e) => updateBlock(block.id, e.target.value)}
                placeholder="Code snippet"
                className="border-none bg-transparent p-0 text-slate-800 dark:text-slate-200 font-mono text-sm focus:ring-0 focus:outline-none resize-none min-h-[32px]"
                rows={3}
                onKeyDown={(e) => handleKeyDown(e, block.id, index)}
                onFocus={() => setActiveBlockId(block.id)}
              />
            </div>
          )}

          {block.type === 'image' && (
            <Card className="border-2 border-dashed border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 mx-2">
              <CardContent className="p-8 text-center">
                <ImageIcon className="w-12 h-12 mx-auto text-slate-400 mb-4" />
                <p className="text-slate-500 text-sm mb-4">Click to upload image or paste URL</p>
                <Input
                  value={block.content}
                  onChange={(e) => updateBlock(block.id, e.target.value)}
                  placeholder="Paste image URL..."
                  className="text-center max-w-md mx-auto"
                  onFocus={() => setActiveBlockId(block.id)}
                />
              </CardContent>
            </Card>
          )}

          {block.type === 'divider' && (
            <div className="py-4 px-4">
              <div className="border-t border-slate-200 dark:border-slate-600"></div>
            </div>
          )}
        </div>

        {/* Inline Block Menu - appears right after the block content */}
        {showBlockMenu === `inline-${block.id}` && (
          <div className="px-6 py-2 relative">
            <BlockTypeMenu afterIndex={index} isInline={true} blockId={block.id} currentBlockIndex={index} />
          </div>
        )}

        {/* Add block section - only show if not showing inline menu */}
        {!showBlockMenu?.startsWith(`inline-${block.id}`) && (
          <div className="px-8 py-2 relative">
            <Button
              variant="ghost"
              size="sm"
              className="menu-trigger opacity-0 group-hover:opacity-100 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all rounded-md px-3 py-1"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowBlockMenu(showBlockMenu === menuId ? null : menuId);
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add block
            </Button>
            {showBlockMenu === menuId && (
              <BlockTypeMenu afterIndex={index} />
            )}
          </div>
        )}
      </div>
    );
  };

  const priorityColors = {
    low: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
    high: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
    urgent: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
  };

  const statusColors = {
    planning: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
    'in-progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
    review: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
    completed: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">PM</span>
            </div>
            <div>
              <h1 className="font-semibold text-slate-900 dark:text-white">ProjectHub</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Create Project</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
            onClick={onBack}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
          
          <div className="pt-4 space-y-2">
            <div className="px-3 py-2">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Project Tools
              </p>
            </div>
            
            <Button
              variant="ghost"
              className="menu-trigger w-full justify-start gap-3 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
              onClick={(e) => {
                e.preventDefault();
                setShowBlockMenu(showBlockMenu === 'sidebar-add' ? null : 'sidebar-add');
              }}
            >
              <Plus className="w-4 h-4" />
              Add Block
            </Button>
            
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
              onClick={handleSave}
              disabled={!projectTitle.trim()}
            >
              <Save className="w-4 h-4" />
              Save Project
            </Button>
          </div>

          {/* Block Types Quick Access */}
          <div className="pt-6">
            <div className="px-3 py-2">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Quick Add
              </p>
            </div>
            <div className="grid grid-cols-3 gap-1">
              {blockTypes.slice(0, 6).map((blockType) => (
                <Button
                  key={blockType.type}
                  variant="ghost"
                  size="sm"
                  className="w-full aspect-square p-2 flex flex-col items-center gap-1 hover:bg-slate-100 dark:hover:bg-slate-700"
                  onClick={() => addBlock(-1, blockType.type as Block['type'])}
                  title={blockType.title}
                >
                  <blockType.icon className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                  <span className="text-xs text-slate-500 dark:text-slate-400">{blockType.title.split(' ')[0]}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Sidebar Block Menu */}
          {showBlockMenu === 'sidebar-add' && (
            <div className="block-menu relative">
              <BlockTypeMenu afterIndex={-1} />
            </div>
          )}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-blue-600 text-white">JD</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                  John Doe
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Creating...
                </p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm sticky top-0 z-40">
          <div className="px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900 dark:text-white">Create New Project</h1>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Build comprehensive project documentation</p>
                </div>
              </div>
              
              <Button 
                onClick={handleSave} 
                className="bg-blue-600 hover:bg-blue-700 shadow-md transition-all hover:shadow-lg"
                disabled={!projectTitle.trim()}
              >
                <Save className="w-4 h-4 mr-2" />
                Save Project
              </Button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-4xl mx-auto">
            {/* Project Title & Metadata */}
            <div className="px-8 py-8">
              <div className="space-y-8">
                {/* Title */}
                <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 shadow-sm">
                  <Input
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                    placeholder="Untitled Project"
                    className="text-4xl font-bold border-none bg-transparent p-0 text-slate-900 dark:text-white focus:ring-0 focus:outline-none placeholder:text-slate-300 h-auto"
                    style={{ fontSize: '2.5rem', lineHeight: '1.2' }}
                  />
                </div>

                {/* Metadata Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="border-0 shadow-sm bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Target className="w-4 h-4 text-slate-500" />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Priority</span>
                      </div>
                      <select
                        value={metadata.priority}
                        onChange={(e) => setMetadata({...metadata, priority: e.target.value as any})}
                        className="w-full bg-transparent border border-slate-200 dark:border-slate-600 rounded-md px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                      <Badge className={`mt-2 ${priorityColors[metadata.priority]}`}>
                        {metadata.priority.charAt(0).toUpperCase() + metadata.priority.slice(1)}
                      </Badge>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-sm bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Palette className="w-4 h-4 text-slate-500" />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Status</span>
                      </div>
                      <select
                        value={metadata.status}
                        onChange={(e) => setMetadata({...metadata, status: e.target.value as any})}
                        className="w-full bg-transparent border border-slate-200 dark:border-slate-600 rounded-md px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      >
                        <option value="planning">Planning</option>
                        <option value="in-progress">In Progress</option>
                        <option value="review">Review</option>
                        <option value="completed">Completed</option>
                      </select>
                      <Badge className={`mt-2 ${statusColors[metadata.status]}`}>
                        {metadata.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Badge>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-sm bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Calendar className="w-4 h-4 text-slate-500" />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Timeline</span>
                      </div>
                      <Input
                        type="date"
                        value={metadata.startDate}
                        onChange={(e) => setMetadata({...metadata, startDate: e.target.value})}
                        className="w-full text-sm border border-slate-200 dark:border-slate-600 rounded-md px-3 py-2"
                        placeholder="Start date"
                      />
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-sm bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <DollarSign className="w-4 h-4 text-slate-500" />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Budget</span>
                      </div>
                      <Input
                        value={metadata.budget}
                        onChange={(e) => setMetadata({...metadata, budget: e.target.value})}
                        placeholder="$0"
                        className="w-full text-sm border border-slate-200 dark:border-slate-600 rounded-md px-3 py-2"
                      />
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            {/* Content Blocks */}
            <div className="pb-20">
              {blocks.length === 0 ? (
                <div className="px-8 py-12 text-center">
                  <div className="max-w-md mx-auto bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl p-8 shadow-sm">
                    <FileText className="w-16 h-16 mx-auto text-slate-300 mb-6" />
                    <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-400 mb-2">
                      Start building your project
                    </h3>
                    <p className="text-slate-500 mb-6">
                      Click the button below to add your first content block
                    </p>
                    <Button
                      className="menu-trigger bg-blue-600 hover:bg-blue-700"
                      onClick={(e) => {
                        e.preventDefault();
                        setShowBlockMenu(showBlockMenu === 'initial' ? null : 'initial');
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add your first block
                    </Button>
                    {showBlockMenu === 'initial' && (
                      <div className="block-menu mt-4 relative flex justify-center">
                        <BlockTypeMenu afterIndex={-1} />
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  {blocks.map((block, index) => renderBlock(block, index))}
                  
                  {/* Final Add Block Button */}
                  <div className="px-8 py-4 relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="menu-trigger text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all rounded-md px-4 py-2"
                      onClick={(e) => {
                        e.preventDefault();
                        setShowBlockMenu(showBlockMenu === 'final' ? null : 'final');
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add a block
                    </Button>
                    {showBlockMenu === 'final' && (
                      <BlockTypeMenu afterIndex={blocks.length - 1} />
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};