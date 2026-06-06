import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { DashboardCards } from '../components/DashboardCards';
import { Charts } from '../components/Charts';
import { SubscriptionList } from '../components/SubscriptionList';
import { AddSubscriptionModal } from '../components/AddSubscriptionModal';
import { Subscription } from '../types';

interface DashboardProps {
  subscriptions: Subscription[];
  addSubscription: (sub: Subscription) => void;
  updateSubscription: (id: string, sub: Partial<Subscription>) => void;
  deleteSubscription: (id: string) => void;
  isPro: boolean;
  onUpgradeClick: () => void;
  renewalAlertDays?: number;
  localCurrency?: string;
}

export function Dashboard({ subscriptions, addSubscription, updateSubscription, deleteSubscription, isPro, onUpgradeClick, renewalAlertDays, localCurrency = 'USD' }: DashboardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSub, setEditingSub] = useState<Subscription | null>(null);

  const handleCreateNew = () => {
    if (!isPro && subscriptions.length >= 4) {
      onUpgradeClick();
      return;
    }
    setEditingSub(null);
    setIsModalOpen(true);
  };

  const handleEdit = (sub: Subscription) => {
    setEditingSub(sub);
    setIsModalOpen(true);
  };

  const handleSave = (sub: Subscription) => {
    if (editingSub) {
      updateSubscription(sub.id, sub);
    } else {
      addSubscription(sub);
    }
  };

  return (
    <div className="flex-1 w-full mx-auto">
        <div className="max-w-7xl mx-auto p-4 md:p-10 pb-24 md:pb-10">
          <DashboardCards subscriptions={subscriptions} localCurrency={localCurrency} />
          
          <div className="flex flex-col gap-8 items-stretch mt-4">
            <div className="w-full">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-400 flex items-center gap-2">
                  قائمة الاشتراكات
                </h3>
                <button
                  onClick={handleCreateNew}
                  className="inline-flex items-center gap-2 px-3 py-2 text-xs font-bold text-black bg-white rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">اشتراك جديد</span>
                </button>
              </div>
              <SubscriptionList 
                subscriptions={subscriptions}
                onEdit={handleEdit}
                onDelete={deleteSubscription}
                renewalAlertDays={renewalAlertDays}
                localCurrency={localCurrency}
              />
            </div>

            <div className="w-full">
              <Charts subscriptions={subscriptions} />
            </div>
          </div>
      </div>

      <AddSubscriptionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        editingSub={editingSub}
        isPro={isPro}
      />
    </div>
  );
}
