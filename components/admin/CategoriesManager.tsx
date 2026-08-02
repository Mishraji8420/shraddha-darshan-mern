"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Loader2, Check, X } from "lucide-react";
import { categoryIconMap } from "@/lib/icon-map";
import { useAdminToast } from "./AdminToastProvider";

interface Category {
  id: number;
  title: string;
  slug: string;
  icon: string;
  _count: { products: number };
}

// Trophy/Sparkles are reserved for the "Best Seller"/"New" virtual badge
// filters (see constants/categories.ts) — not offered here since they're
// not real categories.
const ICON_CHOICES = ["Gift", "Home", "Gem", "Car", "Lamp", "GiElephant", "GiCow"];

function IconPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {ICON_CHOICES.map((iconName) => {
        const Icon = categoryIconMap[iconName];
        const isSelected = value === iconName;
        return (
          <button
            key={iconName}
            type="button"
            onClick={() => onChange(iconName)}
            aria-label={iconName}
            className={`flex h-9 w-9 items-center justify-center rounded-lg border transition ${
              isSelected
                ? "border-yellow-400 bg-yellow-400/10 text-yellow-400"
                : "border-white/10 text-gray-500 hover:border-white/30"
            }`}
          >
            {Icon && <Icon size={16} />}
          </button>
        );
      })}
    </div>
  );
}

export default function CategoriesManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useAdminToast();

  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newIcon, setNewIcon] = useState("Gift");
  const [creating, setCreating] = useState(false);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editIcon, setEditIcon] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  function loadCategories() {
    setLoading(true);
    fetch("/api/admin/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data.categories ?? []))
      .catch(() => showToast("error", "Could not load categories."))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time data load on mount, not derived UI state
    loadCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- one-time load on mount
  }, []);

  async function handleCreate() {
    if (!newTitle.trim()) {
      showToast("error", "Category name is required.");
      return;
    }
    setCreating(true);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle, icon: newIcon }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast("error", data.error || "Could not create category.");
        return;
      }
      showToast("success", "Category created.");
      setNewTitle("");
      setNewIcon("Gift");
      setShowAddForm(false);
      loadCategories();
    } catch {
      showToast("error", "Network error. Please try again.");
    } finally {
      setCreating(false);
    }
  }

  function startEdit(category: Category) {
    setEditingId(category.id);
    setEditTitle(category.title);
    setEditIcon(category.icon);
  }

  async function handleSaveEdit(id: number) {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editTitle, icon: editIcon }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast("error", data.error || "Could not update category.");
        return;
      }
      showToast("success", "Category updated.");
      setEditingId(null);
      loadCategories();
    } catch {
      showToast("error", "Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number, title: string) {
    if (!window.confirm(`Delete "${title}"?`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        showToast("error", data.error || "Could not delete category.");
        return;
      }
      showToast("success", "Category deleted.");
      loadCategories();
    } catch {
      showToast("error", "Network error. Please try again.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{categories.length} categories</p>
        <button
          type="button"
          onClick={() => setShowAddForm((v) => !v)}
          className="flex items-center gap-2 rounded-lg bg-yellow-400 px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-yellow-300"
        >
          <Plus size={16} />
          Add Category
        </button>
      </div>

      {showAddForm && (
        <div className="mt-4 rounded-2xl border border-white/10 bg-[#0f0f0f] p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-300">Name</label>
              <input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Wedding Gifts"
                className="w-full rounded-lg border border-white/10 bg-[#0a0a0a] px-3.5 py-2.5 text-sm text-white outline-none focus:border-yellow-400"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-300">Icon</label>
              <IconPicker value={newIcon} onChange={setNewIcon} />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={handleCreate}
              disabled={creating}
              className="flex items-center gap-2 rounded-lg bg-yellow-400 px-4 py-2 text-sm font-semibold text-black transition hover:bg-yellow-300 disabled:opacity-60"
            >
              {creating && <Loader2 size={14} className="animate-spin" />}
              Create
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-400 transition hover:text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="mt-5 overflow-hidden rounded-2xl border border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#0f0f0f] text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Slug</th>
              <th className="px-4 py-3 font-medium">Products</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 bg-[#0a0a0a]">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-4 py-12 text-center text-gray-500">
                  <Loader2 size={18} className="mx-auto animate-spin" />
                </td>
              </tr>
            ) : (
              categories.map((category) => {
                const Icon = categoryIconMap[category.icon];
                const isEditing = editingId === category.id;

                return (
                  <tr key={category.id} className="transition hover:bg-white/5">
                    {isEditing ? (
                      <>
                        <td className="px-4 py-3">
                          <input
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="w-full rounded-lg border border-white/10 bg-[#0f0f0f] px-2.5 py-1.5 text-sm text-white outline-none focus:border-yellow-400"
                          />
                        </td>
                        <td className="px-4 py-3 text-gray-600">{category.slug}</td>
                        <td className="px-4 py-3" colSpan={1}>
                          <IconPicker value={editIcon} onChange={setEditIcon} />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => handleSaveEdit(category.id)}
                              disabled={saving}
                              aria-label="Save"
                              className="rounded-lg p-2 text-green-400 transition hover:bg-white/10"
                            >
                              {saving ? (
                                <Loader2 size={15} className="animate-spin" />
                              ) : (
                                <Check size={15} />
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingId(null)}
                              aria-label="Cancel"
                              className="rounded-lg p-2 text-gray-400 transition hover:bg-white/10"
                            >
                              <X size={15} />
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-400/10 text-yellow-400">
                              {Icon && <Icon size={15} />}
                            </div>
                            <span className="font-medium text-white">{category.title}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-500">{category.slug}</td>
                        <td className="px-4 py-3 text-gray-400">{category._count.products}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => startEdit(category)}
                              aria-label="Edit category"
                              className="rounded-lg p-2 text-gray-400 transition hover:bg-white/10 hover:text-yellow-400"
                            >
                              <Pencil size={15} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(category.id, category.title)}
                              disabled={deletingId === category.id}
                              aria-label="Delete category"
                              className="rounded-lg p-2 text-gray-400 transition hover:bg-white/10 hover:text-red-400 disabled:opacity-50"
                            >
                              {deletingId === category.id ? (
                                <Loader2 size={15} className="animate-spin" />
                              ) : (
                                <Trash2 size={15} />
                              )}
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
