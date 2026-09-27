import React, { useState, useEffect } from 'react';
import { BloodRequest, User } from '../types';
import { api } from '../lib/api';
import { PlusCircle, Heart, MapPin, Hospital, Trash2, ArrowLeft } from 'lucide-react';

interface MyRequestsProps {
  currentUser: User | null;
  onOpenCreateRequest: () => void;
  onSelectRequest: (req: BloodRequest) => void;
  onDeleteRequest: (reqId: string) => void;
}

export const MyRequests: React.FC<MyRequestsProps> = ({
  currentUser,
  onOpenCreateRequest,
  onSelectRequest,
  onDeleteRequest,
}) => {
  const [requests, setRequests] = useState<BloodRequest[]>([]);

  useEffect(() => {
    api.getRequests().then((all) => {
      const myCreated = all.filter(
        (r) =>
          r.createdByEmail === currentUser?.email ||
          r.contactPhone === currentUser?.phone ||
          (r.pledgedDonors && r.pledgedDonors.some((p) => p.donorEmail === currentUser?.email || p.donorPhone === currentUser?.phone))
      );
      setRequests(myCreated);
    });
  }, [currentUser]);

  return (
    <div className="space-y-6 text-right">
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-stone-900">طلباتي وتعهداتي الإنسانية</h2>
          <p className="text-xs text-stone-500 mt-0.5">
            الحالات التي قمت بنشرها أو تعهدت بالتبرع لها
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenCreateRequest}
          className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>تسجيل طلب جديد</span>
        </button>
      </div>

      {requests.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 space-y-3">
          <Heart className="w-12 h-12 text-stone-300 mx-auto" />
          <h4 className="font-bold text-stone-800 text-base">لا توجد طلبات أو تعهدات مسجلة لك حالياً</h4>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            يمكنك نشر حالة مريض يحتاج إلى دم، أو التعهد بالتبرع لإحدى الحالات النشطة في القائمة العامة.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={onOpenCreateRequest}
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              تسجيل طلب دم الآن
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {requests.map((req) => (
            <div
              key={req.id}
              className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-red-600 text-white font-mono font-black text-base flex items-center justify-center">
                      {req.requiredBloodType}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-stone-900 leading-snug">{req.patientName}</h4>
                      <span className="text-[11px] text-stone-500">{req.city}</span>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${
                      req.status === 'ACTIVE'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {req.status === 'ACTIVE' ? 'نشط' : 'مكتمل'}
                  </span>
                </div>

                <div className="space-y-1 text-xs text-stone-600 pt-2 border-t border-stone-100">
                  <div className="flex items-center gap-1.5">
                    <Hospital className="w-3.5 h-3.5 text-stone-400" />
                    <span>{req.hospital}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] pt-1 font-mono">
                    <span>الوحدات:</span>
                    <strong className="text-red-600 font-bold">
                      {req.unitsPledged} من {req.unitsNeeded}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center gap-2 border-t border-stone-100 mt-2">
                <button
                  type="button"
                  onClick={() => onSelectRequest(req)}
                  className="flex-1 py-2 px-3 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  عرض التفاصيل
                </button>

                <button
                  type="button"
                  onClick={() => onDeleteRequest(req.id)}
                  className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                  title="حذف"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
