import * as Form from "@/components/ui/form";
import { IconSymbol, IconSymbolName } from "@/components/ui/icon-symbol";
import * as AC from "@bacons/apple-colors";
import { useState } from "react";
import { Image, OpaqueColorValue, Text, View } from "react-native";
import {
  Segments,
  SegmentsContent,
  SegmentsList,
  SegmentsTrigger,
} from "@/components/ui/segments";

type Model = {
  id: string;
  name: string;
  provider: string;
  description: string;
  icon: IconSymbolName;
  color: OpaqueColorValue;
  contextWindow: string;
  speed: "Fast" | "Medium" | "Slow";
};

const AI_MODELS: Model[] = [
  {
    id: "claude-opus",
    name: "Claude Opus 4",
    provider: "Anthropic",
    description: "Most capable model for complex tasks",
    icon: "brain.head.profile",
    color: AC.systemOrange,
    contextWindow: "200K",
    speed: "Medium",
  },
  {
    id: "claude-sonnet",
    name: "Claude Sonnet 4",
    provider: "Anthropic",
    description: "Balanced performance and speed",
    icon: "bolt.fill",
    color: AC.systemPurple,
    contextWindow: "200K",
    speed: "Fast",
  },
  {
    id: "gpt-4o",
    name: "GPT-4o",
    provider: "OpenAI",
    description: "Multimodal flagship model",
    icon: "sparkles",
    color: AC.systemGreen,
    contextWindow: "128K",
    speed: "Fast",
  },
  {
    id: "gpt-4-turbo",
    name: "GPT-4 Turbo",
    provider: "OpenAI",
    description: "Enhanced reasoning capabilities",
    icon: "cpu.fill",
    color: AC.systemTeal,
    contextWindow: "128K",
    speed: "Medium",
  },
  {
    id: "gemini-pro",
    name: "Gemini 2.0 Pro",
    provider: "Google",
    description: "Advanced multimodal reasoning",
    icon: "wand.and.stars",
    color: AC.systemBlue,
    contextWindow: "1M",
    speed: "Fast",
  },
  {
    id: "llama-3",
    name: "Llama 3.3 70B",
    provider: "Meta",
    description: "Open-source powerhouse",
    icon: "server.rack",
    color: AC.systemIndigo,
    contextWindow: "128K",
    speed: "Fast",
  },
];

function ModelBadge({
  color,
  icon,
}: {
  color: OpaqueColorValue;
  icon: IconSymbolName;
}) {
  return (
    <View
      style={{
        backgroundColor: color,
        borderRadius: 8,
        width: 36,
        height: 36,
        borderCurve: "continuous",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <IconSymbol name={icon} size={20} color="white" />
    </View>
  );
}

function ModelItem({
  model,
  selected,
  onSelect,
}: {
  model: Model;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <Form.FormItem onPress={onSelect}>
      <Form.HStack style={{ gap: 12, alignItems: "center" }}>
        <ModelBadge color={model.color} icon={model.icon} />
        <View style={{ flex: 1, gap: 2 }}>
          <Form.Text bold>{model.name}</Form.Text>
          <Form.Text style={Form.FormFont.caption}>{model.provider}</Form.Text>
        </View>
        {selected && (
          <IconSymbol name="checkmark" size={20} color={AC.systemBlue} />
        )}
      </Form.HStack>
    </Form.FormItem>
  );
}

function ModelSelector({
  selectedModel,
  onSelectModel,
}: {
  selectedModel: string;
  onSelectModel: (id: string) => void;
}) {
  return (
    <Form.Section title="Select Model" footer="Choose an AI model for your chat">
      {AI_MODELS.map((model) => (
        <ModelItem
          key={model.id}
          model={model}
          selected={selectedModel === model.id}
          onSelect={() => onSelectModel(model.id)}
        />
      ))}
    </Form.Section>
  );
}

function ModelDetails({ model }: { model: Model }) {
  return (
    <Form.Section title="Model Info">
      <Form.Text hint={model.contextWindow}>Context Window</Form.Text>
      <Form.Text hint={model.speed}>Response Speed</Form.Text>
      <Form.Text
        hint={model.description}
        style={{ flexShrink: 1 }}
      >
        Description
      </Form.Text>
    </Form.Section>
  );
}

function ParametersSection() {
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(4096);
  const [streaming, setStreaming] = useState(true);
  const [systemPrompt, setSystemPrompt] = useState(true);

  return (
    <>
      <Form.Section title="Parameters">
        <Form.Text hint={temperature.toFixed(1)}>Temperature</Form.Text>
        <Form.Text hint={maxTokens.toString()}>Max Tokens</Form.Text>
      </Form.Section>

      <Form.Section title="Options" footer="Streaming enables real-time responses">
        <Form.Toggle value={streaming} onValueChange={setStreaming}>
          Stream Responses
        </Form.Toggle>
        <Form.Toggle
          value={systemPrompt}
          onValueChange={setSystemPrompt}
          systemImage="text.quote"
        >
          Use System Prompt
        </Form.Toggle>
      </Form.Section>
    </>
  );
}

function CapabilitiesSection() {
  const [codeExecution, setCodeExecution] = useState(false);
  const [webBrowsing, setWebBrowsing] = useState(true);
  const [imageGen, setImageGen] = useState(false);
  const [fileUpload, setFileUpload] = useState(true);

  return (
    <Form.Section title="Capabilities" footer="Enable or disable model capabilities">
      <Form.Toggle
        systemImage="terminal.fill"
        value={codeExecution}
        onValueChange={setCodeExecution}
      >
        Code Execution
      </Form.Toggle>
      <Form.Toggle
        systemImage="globe"
        value={webBrowsing}
        onValueChange={setWebBrowsing}
      >
        Web Browsing
      </Form.Toggle>
      <Form.Toggle
        systemImage="photo.fill"
        value={imageGen}
        onValueChange={setImageGen}
      >
        Image Generation
      </Form.Toggle>
      <Form.Toggle
        systemImage="doc.fill"
        value={fileUpload}
        onValueChange={setFileUpload}
      >
        File Upload
      </Form.Toggle>
    </Form.Section>
  );
}

function PresetsSection() {
  return (
    <Form.Section title="Presets">
      <Form.Link
        href="/ai-models"
        systemImage={{ name: "pencil.and.outline", color: AC.systemBlue }}
      >
        Creative Writing
      </Form.Link>
      <Form.Link
        href="/ai-models"
        systemImage={{ name: "chevron.left.forwardslash.chevron.right", color: AC.systemGreen }}
      >
        Code Assistant
      </Form.Link>
      <Form.Link
        href="/ai-models"
        systemImage={{ name: "text.magnifyingglass", color: AC.systemOrange }}
      >
        Research Helper
      </Form.Link>
      <Form.Link
        href="/ai-models"
        systemImage={{ name: "bubble.left.and.bubble.right.fill", color: AC.systemPurple }}
      >
        Conversational
      </Form.Link>
    </Form.Section>
  );
}

function APIStatusSection() {
  return (
    <Form.Section>
      <Form.HStack style={{ alignItems: "center", gap: 12 }}>
        <View
          style={{
            width: 10,
            height: 10,
            borderRadius: 5,
            backgroundColor: AC.systemGreen,
          }}
        />
        <Form.Text>API Status</Form.Text>
        <View style={{ flex: 1 }} />
        <Form.Text style={{ color: AC.systemGreen }}>Operational</Form.Text>
      </Form.HStack>
      <Form.Text hint="42ms">Latency</Form.Text>
      <Form.Text hint="1,247">Requests Today</Form.Text>
    </Form.Section>
  );
}

function UsageSection() {
  return (
    <Form.Section title="Usage This Month">
      <Form.HStack style={{ alignItems: "stretch", gap: 12 }}>
        <UsageCard title="Tokens" value="1.2M" subtitle="of 5M" />
        <View
          style={{
            backgroundColor: AC.separator,
            width: 0.5,
            maxHeight: "50%",
            minHeight: "50%",
            marginVertical: "auto",
          }}
        />
        <UsageCard title="Requests" value="8.4K" subtitle="of 50K" />
        <View
          style={{
            backgroundColor: AC.separator,
            width: 0.5,
            maxHeight: "50%",
            minHeight: "50%",
            marginVertical: "auto",
          }}
        />
        <UsageCard title="Cost" value="$24" subtitle="of $100" />
      </Form.HStack>
    </Form.Section>
  );
}

function UsageCard({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: string;
  subtitle: string;
}) {
  return (
    <View style={{ alignItems: "center", gap: 4, flex: 1 }}>
      <Form.Text
        style={{
          textTransform: "uppercase",
          fontSize: 10,
          fontWeight: "600",
          color: AC.secondaryLabel,
        }}
      >
        {title}
      </Form.Text>
      <Form.Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          color: AC.label,
        }}
      >
        {value}
      </Form.Text>
      <Form.Text
        style={{
          fontSize: 12,
          color: AC.secondaryLabel,
        }}
      >
        {subtitle}
      </Form.Text>
    </View>
  );
}

function TabsDemo() {
  const [selectedModel, setSelectedModel] = useState("claude-sonnet");
  const model = AI_MODELS.find((m) => m.id === selectedModel)!;

  return (
    <Segments defaultValue="models">
      <Form.Section>
        <SegmentsList>
          <SegmentsTrigger value="models">Models</SegmentsTrigger>
          <SegmentsTrigger value="settings">Settings</SegmentsTrigger>
          <SegmentsTrigger value="usage">Usage</SegmentsTrigger>
        </SegmentsList>
      </Form.Section>

      <SegmentsContent value="models">
        <ModelSelector
          selectedModel={selectedModel}
          onSelectModel={setSelectedModel}
        />
        <ModelDetails model={model} />
        <PresetsSection />
      </SegmentsContent>

      <SegmentsContent value="settings">
        <ParametersSection />
        <CapabilitiesSection />
      </SegmentsContent>

      <SegmentsContent value="usage">
        <UsageSection />
        <APIStatusSection />
      </SegmentsContent>
    </Segments>
  );
}

export default function Page() {
  return (
    <Form.List navigationTitle="AI Models">
      <Form.Section>
        <Form.HStack style={{ alignItems: "center", gap: 12, paddingVertical: 8 }}>
          <View
            style={{
              width: 56,
              height: 56,
              borderRadius: 12,
              borderCurve: "continuous",
              backgroundColor: AC.systemPurple,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <IconSymbol name="brain" size={32} color="white" />
          </View>
          <View style={{ flex: 1, gap: 4 }}>
            <Form.Text style={{ fontSize: 20, fontWeight: "600" }}>
              AI Assistant
            </Form.Text>
            <Form.Text style={Form.FormFont.caption}>
              Configure your AI model preferences
            </Form.Text>
          </View>
        </Form.HStack>
      </Form.Section>

      <TabsDemo />
    </Form.List>
  );
}
