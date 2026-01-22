"use client";

import { useCallback, useMemo } from "react";
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  type Connection,
  addEdge,
  type NodeTypes,
  MarkerType,
  Handle,
  Position,
  EdgeLabelRenderer,
  type EdgeProps,
  getBezierPath,
  getStraightPath,
} from "@xyflow/react";
import { useTheme } from "next-themes";
import { Globe, Smartphone, Apple, Database } from "lucide-react";
import "@xyflow/react/dist/style.css";

// Custom edge with wrapping label
function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}: EdgeProps) {
  const { theme, systemTheme } = useTheme();
  const isDark = (theme === "system" ? systemTheme : theme) === "dark";
  const strokeColor = isDark ? "#ffffff" : "#000000";

  // Use Bezier path for curved edges, straight path for others
  const useBezier = data?.useBezier === true;

  let edgePath, labelX, labelY;

  if (useBezier && data?.customCurve) {
    // Custom curve that goes out to the right and back
    const curveOffset = 80; // How far to the right the curve extends
    const midX = Math.max(sourceX, targetX) + curveOffset;
    const midY = (sourceY + targetY) / 2;

    // Create a custom bezier path using SVG path syntax
    edgePath = `M ${sourceX},${sourceY} C ${midX},${sourceY} ${midX},${targetY} ${targetX},${targetY}`;
    labelX = midX;
    labelY = midY;
  } else if (useBezier) {
    [edgePath, labelX, labelY] = getBezierPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
    });
  } else {
    [edgePath, labelX, labelY] = getStraightPath({
      sourceX,
      sourceY,
      targetX,
      targetY,
    });
  }

  // Adjust label position if specified
  const finalLabelX = typeof data?.labelOffsetX === 'number' ? labelX + data.labelOffsetX : labelX;
  const finalLabelY = typeof data?.labelOffsetY === 'number' ? labelY + data.labelOffsetY : labelY;

  // Unique marker ID for this edge to support theme colors
  const markerId = `arrow-${isDark ? 'dark' : 'light'}`;

  return (
    <>
      <path
        id={id}
        d={edgePath}
        strokeWidth={2}
        stroke={strokeColor}
        strokeDasharray="5,5"
        markerEnd={`url(#${markerId})`}
        fill="none"
        style={{
          animation: 'dashdraw 0.5s linear infinite',
        }}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${finalLabelX}px,${finalLabelY}px)`,
            pointerEvents: 'all',
          }}
          className="nodrag nopan"
        >
          <div className="relative bg-white dark:bg-gray-800 border border-gray-400 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-[8px] font-semibold px-1.5 py-1 rounded max-w-[80px] text-center leading-tight">
            <a
              href={`#${data?.label || "1"}`}
              className="absolute -top-2 -left-2 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[9px] font-bold hover:bg-red-600 transition-colors cursor-pointer"
            >
              {String(data?.label || "1")}
            </a>
            {String(data?.text || "Check which charts have been recently updated")}
          </div>
        </div>
      </EdgeLabelRenderer>
      <defs>
        <marker
          id={markerId}
          markerWidth="8"
          markerHeight="8"
          refX="7"
          refY="2.5"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path d="M0,0 L0,5 L7,2.5 z" fill={strokeColor} />
        </marker>
      </defs>
      <style>{`
        @keyframes dashdraw {
          to {
            stroke-dashoffset: -10;
          }
        }
      `}</style>
    </>
  );
}

// Custom node component for Client Applications
function ClientAppsNode() {
  return (
    <>
      <Handle type="target" position={Position.Right} id="right" />
      <Handle type="target" position={Position.Bottom} id="bottom" />
      <div className="px-2 py-1.5 border border-gray-400 dark:border-gray-600 rounded bg-transparent text-[10px]">
        <div className="font-semibold mb-1">Client Applications</div>
        <div className="space-y-1">
          <div className="flex items-center gap-1">
            <Globe size={10} />
            <span>NextJS</span>
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-1">
              <Smartphone size={10} />
              <span>Kotlin Multiplatform</span>
            </div>
            <div className="ml-3 flex items-center gap-1 text-[9px]">
              <Smartphone size={8} />
              <span>Android</span>
            </div>
            <div className="ml-3 flex items-center gap-1 text-[9px]">
              <Apple size={8} />
              <span>iOS</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Custom node component for Backend
function BackendNode() {
  return (
    <>
      <Handle type="source" position={Position.Left} id="left" />
      <Handle type="target" position={Position.Right} id="right" />
      <div className="px-2 py-1.5 border border-gray-400 dark:border-gray-600 rounded bg-transparent text-[10px]">
        <div className="font-semibold mb-1">Backend</div>
        <div className="mb-1 text-[9px]">(Lambda, DynamoDB)</div>
        <div className="border-t border-gray-300 dark:border-gray-600 pt-1 mt-1">
          <div className="flex items-center gap-1 mb-0.5">
            <Database size={8} />
            <span className="font-semibold text-[9px]">Chart metadata:</span>
          </div>
          <div className="ml-2 space-y-0.5 text-[8px] font-mono">
            <div>file_key</div>
            <div>interval: daily | weekly</div>
            <div>title</div>
            <div>updatedAt</div>
          </div>
        </div>
      </div>
    </>
  );
}

// Custom node component for Docker/Cron
function DockerCronNode() {
  return (
    <>
      <Handle type="target" position={Position.Top} id="top" />
      <Handle type="target" position={Position.Left} id="left" />
      <div className="px-2 py-1.5 border border-gray-400 dark:border-gray-600 rounded bg-transparent text-[10px]">
        <div className="font-semibold mb-1">Docker/Cron</div>
        <div className="mb-1 text-[9px]">R Scripts scheduler</div>
        <div className="mb-1 text-[9px]">Hosted on fly.io</div>
        <div className="border-t border-gray-300 dark:border-gray-600 pt-1 mt-1">
          <div className="space-y-0.5 text-[8px]">
            <div>FROM rocker/tidyverse:latest</div>
            <div className="mt-1">
              <div className="font-semibold text-[9px]">R Dependencies:</div>
              <div className="ml-2">
                <div>nflreadR</div>
                <div>hoopR</div>
              </div>
            </div>
            <div className="mt-1">cron for scheduled scripts</div>
          </div>
        </div>
      </div>
      <Handle type="source" position={Position.Left} id="source-left" />
      <Handle type="source" position={Position.Right} id="right" />
    </>
  );
}

// Custom node component for S3
function S3Node() {
  return (
    <>
      <Handle type="source" position={Position.Top} id="top" />
      <Handle type="target" position={Position.Right} id="right" />
      <div className="px-2 py-1.5 border border-gray-400 dark:border-gray-600 rounded bg-transparent text-[10px]">
        <div className="font-semibold">S3 Bucket behind CloudFront</div>
        <div className="text-[9px]">(JSON Charts)</div>
        <div className="border-t border-gray-300 dark:border-gray-600 pt-1 mt-1">
          <div className="flex items-center gap-1 mb-0.5">
            <Database size={8} />
            <span className="font-semibold text-[9px]">Chart definition:</span>
          </div>
          <div className="ml-2 space-y-0.5 text-[8px] font-mono">
            <div className="ml-2">&#123; name,</div>
            <div className="ml-4">dataPoints: [] &#125;</div>
          </div>
        </div>
      </div>
    </>
  );
}

// Node types
const nodeTypes: NodeTypes = {
  clientApps: ClientAppsNode,
  backend: BackendNode,
  dockerCron: DockerCronNode,
  s3: S3Node,
};

// Edge types
const edgeTypes = {
  custom: CustomEdge,
};

const initialNodes: Node[] = [
  {
    id: "client-apps",
    type: "clientApps",
    position: { x: 0, y: 50 },
    data: {},
  },
  {
    id: "backend",
    type: "backend",
    position: { x: 450, y: 50 },
    data: {},
  },
  {
    id: "s3",
    type: "s3",
    position: { x: 0, y: 280 },
    data: {},
  },
  {
    id: "docker-cron",
    type: "dockerCron",
    position: { x: 450, y: 200 },
    data: {},
  },
];

const initialEdges: Edge[] = [
  {
    id: "client-backend",
    source: "backend",
    sourceHandle: "left",
    target: "client-apps",
    targetHandle: "right",
    type: "custom",
    data: { label: "1", text: "Check which charts have been recently updated" },
  },
  {
    id: "client-s3",
    source: "s3",
    sourceHandle: "top",
    target: "client-apps",
    targetHandle: "bottom",
    type: "custom",
    data: { label: "2", text: "Download the JSON for the recently updated charts. Cache client side." },
  },
  {
    id: "docker-s3",
    source: "docker-cron",
    sourceHandle: "source-left",
    target: "s3",
    targetHandle: "right",
    type: "custom",
    data: { label: "3", text: "Upload JSON produced by R scripts. Each R script produces one JSON file for one chart." },
  },
  {
    id: "docker-backend",
    source: "docker-cron",
    sourceHandle: "right",
    target: "backend",
    targetHandle: "right",
    type: "custom",
    data: {
      label: "4",
      text: "Each script updates its own meta data stored in Dynamo DB by `file_key`",
      useBezier: true,
      customCurve: true,
    },
  },
];

export default function FastbreakArchitectureFlow() {
  const { theme, systemTheme } = useTheme();

  // Determine if dark mode is active
  const isDark = useMemo(() => {
    const currentTheme = theme === "system" ? systemTheme : theme;
    return currentTheme === "dark";
  }, [theme, systemTheme]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div className="w-full h-[400px] bg-transparent">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView={false}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        className="bg-transparent"
        style={{ background: 'transparent' }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        proOptions={{ hideAttribution: true }}
      />
    </div>
  );
}
