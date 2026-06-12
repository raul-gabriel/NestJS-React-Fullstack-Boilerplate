import { useState, createContext, useContext } from "react";
import type { ReactNode, ReactElement } from "react";

interface TabsContextType {
    activeTab: string;
    setActiveTab: (id: string) => void;
}

const TabsContext = createContext<TabsContextType | null>(null);

function useTabsContext() {
    const ctx = useContext(TabsContext);
    if (!ctx) throw new Error("Tab.Content debe usarse dentro de <Tabs>");
    return ctx;
}

interface TabContentProps {
    title: string;
    id?: string;
    children: ReactNode;
}

interface TabsProps {
    defaultTab: string;
    children: ReactElement<TabContentProps> | ReactElement<TabContentProps>[];
}

export function Tabs({ defaultTab, children }: TabsProps) {
    const [activeTab, setActiveTab] = useState(defaultTab);

    const items = Array.isArray(children) ? children : [children];

    return (
        <TabsContext.Provider value={{ activeTab, setActiveTab }}>
            <div className="w-full">
                {/* Headers */}
                {/* Headers */}
                <div className="flex overflow-x-auto border-b border-gray-200 scrollbar-hide">
                    {items.map((child) => {
                        const { title, id } = child.props;
                        const tabId = id ?? title;
                        return (
                            <button
                                key={tabId}
                                onClick={() => setActiveTab(tabId)}
                                className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px whitespace-nowrap transition-colors
          ${activeTab === tabId
                                        ? "border-blue-500 text-blue-600"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                    }`}
                            >
                                {title}
                            </button>
                        );
                    })}
                </div>

                {/* Contents */}
                <div className="mt-4">{children}</div>
            </div>
        </TabsContext.Provider>
    );
}

export function TabContent({ title, id, children }: TabContentProps) {
    const { activeTab } = useTabsContext();
    const tabId = id ?? title;

    if (activeTab !== tabId) return null;

    return <div>{children}</div>;
}

Tabs.Content = TabContent;


/*
<Tabs defaultTab="Info">
                <Tabs.Content title="Info">Contenido 1</Tabs.Content>
                <Tabs.Content title="Configuración">Contenido 2</Tabs.Content>
            </Tabs>
*/
