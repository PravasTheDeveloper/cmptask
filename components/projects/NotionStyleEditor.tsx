
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Plus, GripVertical, MoreHorizontal, Trash2 } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

interface NotionStyleEditorProps {
  initialBlocks: any[];
  onChange: (blocks: any[]) => void;
}

export const NotionStyleEditor = ({ initialBlocks, onChange }: NotionStyleEditorProps) => {
  const [blocks, setBlocks] = useState(initialBlocks);
  const [showBlockMenu, setShowBlockMenu] = useState(false);
  const [activeBlockId, setActiveBlockId] = useState(null);
  const editorRef = useRef(null);

  const blockTypes = [
    { type: "heading", icon: "H1", label: "Heading 1", category: "text" },
    { type: "heading2", icon: "H2", label: "Heading 2", category: "text" },
    { type: "paragraph", icon: "P", label: "Paragraph", category: "text" },
    { type: "bulletList", icon: "•", label: "Bullet List", category: "list" },
    { type: "numberList", icon: "1.", label: "Numbered List", category: "list" },
    { type: "todoList", icon: "☐", label: "To-do List", category: "list" },
    { type: "divider", icon: "—", label: "Divider", category: "layout" },
    { type: "textField", icon: "T", label: "Text Field", category: "field" },
    { type: "dateField", icon: "📅", label: "Date Field", category: "field" },
    { type: "selectField", icon: "▼", label: "Dropdown", category: "field" },
    { type: "userField", icon: "👤", label: "User Assignment", category: "field" }
  ];

  useEffect(() => {
    onChange(blocks);
  }, [blocks, onChange]);

  const addBlock = (type: string, index?: number) => {
    const newBlock = {
      id: Date.now().toString(),
      type: type,
      content: getDefaultContent(type),
      properties: {}
    };

    const insertIndex = index !== undefined ? index : blocks.length;
    const newBlocks = [...blocks];
    newBlocks.splice(insertIndex, 0, newBlock);
    setBlocks(newBlocks);
    setShowBlockMenu(false);
  };

  const getDefaultContent = (type: string) => {
    switch (type) {
      case "heading":
        return { text: "Heading 1", level: 1 };
      case "heading2":
        return { text: "Heading 2", level: 2 };
      case "paragraph":
        return { text: "Start typing..." };
      case "bulletList":
        return { items: ["Item 1"] };
      case "numberList":
        return { items: ["Item 1"] };
      case "todoList":
        return { items: [{ text: "Task 1", completed: false }] };
      case "divider":
        return {};
      case "textField":
        return { label: "Text Field", placeholder: "Enter text", required: false };
      case "dateField":
        return { label: "Date Field", required: false };
      case "selectField":
        return { label: "Select Field", options: ["Option 1", "Option 2"], required: false };
      case "userField":
        return { label: "Assigned To", required: false };
      default:
        return {};
    }
  };

  const updateBlock = (blockId: string, content: any) => {
    setBlocks(blocks.map(block => 
      block.id === blockId ? { ...block, content } : block
    ));
  };

  const deleteBlock = (blockId: string) => {
    setBlocks(blocks.filter(block => block.id !== blockId));
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(blocks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setBlocks(items);
  };

  const renderBlock = (block, index) => {
    const BlockComponent = getBlockComponent(block.type);
    return (
      <Draggable key={block.id} draggableId={block.id} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            className={`group relative ${snapshot.isDragging ? 'opacity-50' : ''}`}
          >
            <div className="flex items-start gap-2">
              <div 
                {...provided.dragHandleProps}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 cursor-grab"
              >
                <GripVertical className="w-4 h-4 text-slate-400" />
              </div>
              
              <div className="flex-1 min-w-0">
                <BlockComponent 
                  block={block}
                  onChange={(content) => updateBlock(block.id, content)}
                />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 p-0"
                  >
                    <MoreHorizontal className="w-3 h-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => addBlock("paragraph", index + 1)}>
                    Add Block Below
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => deleteBlock(block.id)}
                    className="text-red-600"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        )}
      </Draggable>
    );
  };

  const getBlockComponent = (type: string) => {
    switch (type) {
      case "heading":
      case "heading2":
        return HeadingBlock;
      case "paragraph":
        return ParagraphBlock;
      case "bulletList":
        return BulletListBlock;
      case "todoList":
        return TodoListBlock;
      case "divider":
        return DividerBlock;
      case "textField":
        return TextFieldBlock;
      case "dateField":
        return DateFieldBlock;
      case "selectField":
        return SelectFieldBlock;
      default:
        return ParagraphBlock;
    }
  };

  return (
    <div ref={editorRef} className="space-y-3">
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="blocks">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {blocks.map((block, index) => renderBlock(block, index))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <DropdownMenu open={showBlockMenu} onOpenChange={setShowBlockMenu}>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className="w-full border-2 border-dashed border-slate-300 text-slate-600 hover:border-blue-400 hover:text-blue-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Block (or type "/")
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          {blockTypes.map((blockType) => (
            <DropdownMenuItem 
              key={blockType.type}
              onClick={() => addBlock(blockType.type)}
              className="flex items-center gap-3"
            >
              <span className="w-6 h-6 flex items-center justify-center bg-slate-100 rounded text-xs font-mono">
                {blockType.icon}
              </span>
              <span>{blockType.label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

// Block Components
const HeadingBlock = ({ block, onChange }) => (
  <Input
    value={block.content.text}
    onChange={(e) => onChange({ ...block.content, text: e.target.value })}
    className={`border-none shadow-none px-0 font-bold ${
      block.content.level === 1 ? 'text-2xl' : 'text-xl'
    }`}
    placeholder="Heading"
  />
);

const ParagraphBlock = ({ block, onChange }) => (
  <Textarea
    value={block.content.text}
    onChange={(e) => onChange({ ...block.content, text: e.target.value })}
    className="border-none shadow-none px-0 resize-none"
    placeholder="Start typing..."
    rows={2}
  />
);

const BulletListBlock = ({ block, onChange }) => (
  <div className="space-y-1">
    {block.content.items.map((item, index) => (
      <div key={index} className="flex items-center gap-2">
        <span>•</span>
        <Input
          value={item}
          onChange={(e) => {
            const newItems = [...block.content.items];
            newItems[index] = e.target.value;
            onChange({ ...block.content, items: newItems });
          }}
          className="border-none shadow-none px-0"
          placeholder="List item"
        />
      </div>
    ))}
  </div>
);

const TodoListBlock = ({ block, onChange }) => (
  <div className="space-y-1">
    {block.content.items.map((item, index) => (
      <div key={index} className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={item.completed || false}
          onChange={(e) => {
            const newItems = [...block.content.items];
            newItems[index] = { ...item, completed: e.target.checked };
            onChange({ ...block.content, items: newItems });
          }}
        />
        <Input
          value={item.text}
          onChange={(e) => {
            const newItems = [...block.content.items];
            newItems[index] = { ...item, text: e.target.value };
            onChange({ ...block.content, items: newItems });
          }}
          className="border-none shadow-none px-0"
          placeholder="Task"
        />
      </div>
    ))}
  </div>
);

const DividerBlock = () => (
  <hr className="border-slate-300 my-4" />
);

const TextFieldBlock = ({ block, onChange }) => (
  <div className="space-y-2 p-3 border rounded-lg bg-slate-50">
    <Input
      value={block.content.label}
      onChange={(e) => onChange({ ...block.content, label: e.target.value })}
      placeholder="Field Label"
      className="font-medium"
    />
    <Input
      value={block.content.placeholder}
      onChange={(e) => onChange({ ...block.content, placeholder: e.target.value })}
      placeholder="Placeholder text"
    />
  </div>
);

const DateFieldBlock = ({ block, onChange }) => (
  <div className="space-y-2 p-3 border rounded-lg bg-slate-50">
    <Input
      value={block.content.label}
      onChange={(e) => onChange({ ...block.content, label: e.target.value })}
      placeholder="Date Field Label"
      className="font-medium"
    />
  </div>
);

const SelectFieldBlock = ({ block, onChange }) => (
  <div className="space-y-2 p-3 border rounded-lg bg-slate-50">
    <Input
      value={block.content.label}
      onChange={(e) => onChange({ ...block.content, label: e.target.value })}
      placeholder="Select Field Label"
      className="font-medium"
    />
    <div className="space-y-1">
      {block.content.options.map((option, index) => (
        <Input
          key={index}
          value={option}
          onChange={(e) => {
            const newOptions = [...block.content.options];
            newOptions[index] = e.target.value;
            onChange({ ...block.content, options: newOptions });
          }}
          placeholder={`Option ${index + 1}`}
        />
      ))}
    </div>
  </div>
);
