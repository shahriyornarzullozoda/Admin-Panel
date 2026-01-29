import { useEffect, useState } from "react";
import api from "../shared/api/api";


interface Profile {
  id: number;
  phone: string;
  email: string;
  name: string;
  lastName: string;
  secondName: string;
  isActive: boolean;
  updatedAt: string;
  createdAt: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/profile");
        setProfile(res.data);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div
          className="
          bg-white/70 dark:bg-gray-900/70 
          backdrop-blur-xl 
          border border-white/20 dark:border-gray-800/50 
          shadow-2xl shadow-black/10 dark:shadow-black/40 
          rounded-2xl overflow-hidden
          transition-all duration-300 hover:shadow-3xl
        "
        >
          <div className="relative h-32 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            <div className="absolute -bottom-12 left-6">
              <div
                className="
                w-24 h-24 rounded-full 
                border-4 border-white dark:border-gray-900 
                bg-white dark:bg-gray-800 
                flex items-center justify-center 
                shadow-lg
              "
              ></div>
            </div>
          </div>

          <div className="pt-16 pb-10 px-6 sm:px-10">
            {/* <h1 className="text-3xl font-bold text-gray-900 dark:text-white truncate">
              {fullName || 'Пользователь'}
            </h1> */}

            <div className="mt-8 space-y-6">
              <InfoRow label="Email" value={profile.email} icon="✉️" />

              {profile.phone && (
                <InfoRow label="Телефон" value={profile.phone} icon="📱" />
              )}

              <InfoRow
                label="Статус"
                value={
                  <span
                    className={`
                    inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${
                      profile.isActive
                        ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300"
                        : "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300"
                    }
                  `}
                  >
                    {profile.isActive ? "Активен" : "Неактивен"}
                  </span>
                }
                icon="●"
              />

              <InfoRow
                label="Создан"
                value={new Date(profile.createdAt).toLocaleString("ru-RU", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                icon="📅"
              />

              <InfoRow
                label="Обновлён"
                value={new Date(profile.updatedAt).toLocaleString("ru-RU", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                icon="🔄"
              />
            </div>
          </div>

          <div className="px-6 sm:px-10 pb-8 border-t border-gray-200 dark:border-gray-800 pt-6">
            <button
              className="
              w-full py-3 px-4 
              bg-indigo-600 hover:bg-indigo-700 
              text-white font-medium 
              rounded-xl transition-colors duration-200
              flex items-center justify-center gap-2
              shadow-md hover:shadow-lg
            "
            >
              Редактировать профиль
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  label,
  value,
  icon,
}: {
  label: string;
  value: React.ReactNode;
  icon: string;
}) {
  return (
    <div className="flex items-center gap-4 py-1">
      <span className="text-xl min-w-[1.5rem] text-gray-500 dark:text-gray-400">
        {icon}
      </span>
      <div className="flex-1">
        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {label}
        </dt>
        <dd className="mt-0.5 text-base text-gray-900 dark:text-gray-100">
          {value}
        </dd>
      </div>
    </div>
  );
}
