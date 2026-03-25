"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";

export default function MenuCatalogManager() {
  const queryClient = useQueryClient();
  const [sellerId, setSellerId] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState({ name: "", price: "", prepTime: "15", description: "", imageUrl: "" });
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setSellerId(localStorage.getItem("jb_session") || "test-seller-1");
  }, []);

  const { data: menu = [], isLoading } = useQuery({
    queryKey: ["sellerMenu", sellerId],
    queryFn: async () => {
      if (!sellerId) return [];
      const res = await fetch(`/api/seller/menu?sellerId=${sellerId}`);
      if (!res.ok) throw new Error("Failed to fetch menu");
      return res.json();
    },
    enabled: !!sellerId,
  });

  const toggleBulkMutation = useMutation({
    mutationFn: async ({ productIds, isActive }: { productIds: string[], isActive: boolean }) => {
      const res = await fetch(`/api/seller/menu/bulk?sellerId=${sellerId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productIds, isActive })
      });
      if (!res.ok) throw new Error("Bulk update failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sellerMenu", sellerId] });
      setSelectedItems(new Set());
    }
  });

  const saveItemMutation = useMutation({
    mutationFn: async (data: any) => {
      const method = editingItem ? "PATCH" : "POST";
      const url = editingItem ? `/api/seller/menu/${editingItem.id}` : `/api/seller/menu?sellerId=${sellerId}`;
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error("Save failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sellerMenu", sellerId] });
      handleCloseModal();
    }
  });

  const deleteItemMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!confirm("Are you sure you want to delete this menu item?")) throw new Error("Cancelled");
      const res = await fetch(`/api/seller/menu/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sellerMenu", sellerId] });
    }
  });

  const handleSelect = (id: string) => {
    const newSet = new Set(selectedItems);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedItems(newSet);
  };

  const handleOpenModal = (item?: any) => {
    if (item) {
      setEditingItem(item);
      setFormData({ name: item.name, price: item.price.toString(), prepTime: item.prepTime.toString(), description: item.description || "", imageUrl: item.imageUrl || "" });
    } else {
      setEditingItem(null);
      setFormData({ name: "", price: "", prepTime: "15", description: "", imageUrl: "" });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setFormData({ name: "", price: "", prepTime: "15", description: "", imageUrl: "" });
    setUploadFile(null);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.price || !formData.prepTime) return alert("Fill required fields (Name, Price, Prep Time)");
    
    let finalUrl = formData.imageUrl;

    if (uploadFile) {
      setIsUploading(true);
      try {
        const upData = new FormData();
        upData.append("file", uploadFile);
        const res = await fetch("/api/seller/menu/upload", {
          method: "POST",
          body: upData
        });
        if (!res.ok) throw new Error("Upload failed");
        const { url } = await res.json();
        finalUrl = url;
      } catch (err) {
        alert("Image upload failed. Please try a different file.");
        setIsUploading(false);
        return;
      }
    }

    saveItemMutation.mutate({ ...formData, imageUrl: finalUrl });
  };

  if (isLoading) return <div className="p-8 text-center text-white/50"><p>Loading Catalog Engine...</p></div>;

  return (
    <main className="p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto flex flex-col gap-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <p className="text-teal-400 font-bold tracking-widest uppercase text-sm m-0">Catalog</p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white m-0">Menu Management</h1>
          <p className="text-white/60 m-0 text-lg">Organize your offerings, adjust prep times, and toggle availability.</p>
        </div>
        <button className="px-6 py-3 rounded-xl bg-teal-400 hover:bg-teal-300 text-[#1a1026] font-bold transition-colors whitespace-nowrap shadow-lg shadow-teal-400/20" onClick={() => handleOpenModal()}>
          + Add New Item
        </button>
      </header>

      {selectedItems.size > 0 && (
        <div className="bg-purple-600 p-4 sm:p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4 animate-in fade-in slide-in-from-top-4 shadow-xl shadow-purple-900/20">
          <span className="font-bold text-white text-lg flex items-center gap-3">
            <span className="bg-white/20 text-white w-8 h-8 rounded-full flex items-center justify-center">{selectedItems.size}</span>
            items selected
          </span>
          <div className="flex gap-3 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none px-5 py-2.5 bg-teal-400 hover:bg-teal-300 text-[#1a1026] rounded-xl font-bold transition-colors" onClick={() => toggleBulkMutation.mutate({ productIds: Array.from(selectedItems), isActive: true })} disabled={toggleBulkMutation.isPending}>Set Active</button>
            <button className="flex-1 sm:flex-none px-5 py-2.5 bg-black/40 hover:bg-black/60 text-white rounded-xl font-bold transition-colors" onClick={() => toggleBulkMutation.mutate({ productIds: Array.from(selectedItems), isActive: false })} disabled={toggleBulkMutation.isPending}>Set Inactive</button>
          </div>
        </div>
      )}

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden overflow-x-auto shadow-2xl">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr>
              <th className="p-5 border-b border-white/10 text-white/50 text-[11px] font-bold uppercase tracking-widest bg-[#12021f]/50 w-[60px]">Select</th>
              <th className="p-5 border-b border-white/10 text-white/50 text-[11px] font-bold uppercase tracking-widest bg-[#12021f]/50">Item Name</th>
              <th className="p-5 border-b border-white/10 text-white/50 text-[11px] font-bold uppercase tracking-widest bg-[#12021f]/50">Price (KES)</th>
              <th className="p-5 border-b border-white/10 text-white/50 text-[11px] font-bold uppercase tracking-widest bg-[#12021f]/50">Prep Time</th>
              <th className="p-5 border-b border-white/10 text-white/50 text-[11px] font-bold uppercase tracking-widest bg-[#12021f]/50">Status</th>
              <th className="p-5 border-b border-white/10 text-white/50 text-[11px] font-bold uppercase tracking-widest bg-[#12021f]/50 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {menu.map((item: any) => (
              <tr key={item.id} className={`transition-colors group ${selectedItems.has(item.id) ? "bg-purple-500/10" : "hover:bg-white/5"}`}>
                <td className="p-4 px-5">
                  <div className="relative flex items-center justify-center">
                    <input 
                      type="checkbox" 
                      className="peer appearance-none w-5 h-5 border border-white/20 rounded bg-white/5 checked:bg-purple-600 checked:border-purple-600 cursor-pointer transition-all" 
                      checked={selectedItems.has(item.id)} 
                      onChange={() => handleSelect(item.id)} 
                    />
                    <svg className="absolute w-3 h-3 pointer-events-none opacity-0 peer-checked:opacity-100 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-4">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="w-12 h-12 rounded-xl object-cover border border-white/10 shadow-sm" />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-xs text-white/40 border border-white/5 font-medium">No Img</div>
                    )}
                    <div className="flex flex-col">
                      <strong className="text-white text-[15px] group-hover:text-teal-400 transition-colors">{item.name}</strong>
                      {item.description && <span className="text-sm text-white/50">{item.description.substring(0, 45)}{item.description.length > 45 ? '...' : ''}</span>}
                    </div>
                  </div>
                </td>
                <td className="p-4 font-bold text-teal-400">KES {item.price}</td>
                <td className="p-4 text-white/80 font-medium">{item.prepTime} mins</td>
                <td className="p-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${item.isActive ? 'bg-teal-400/10 text-teal-400 border-teal-400/20' : 'bg-white/5 text-white/40 border-white/10'}`}>
                    {item.isActive ? "Active" : "Disabled"}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button className="px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors border border-white/10 bg-white/5 hover:bg-white/10 text-white" onClick={() => handleOpenModal(item)}>Edit</button>
                    <button className="px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors border border-red-500/20 bg-red-500/10 hover:bg-red-500/20 text-red-400" onClick={() => deleteItemMutation.mutate(item.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {menu.length === 0 && !isLoading && (
              <tr>
                <td colSpan={6} className="p-16 text-center text-white/50 italic border-dashed border-t border-b border-white/10">
                  <div className="flex flex-col items-center gap-3">
                    <span className="text-4xl opacity-50">🍽️</span>
                    <span>Your menu is currently empty. Click "Add New Item" to create your first product.</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-[#1a1026] border border-white/10 rounded-2xl p-6 md:p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200 shadow-2xl">
            <h2 className="m-0 mb-6 text-2xl font-bold text-white flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-teal-400/20 text-teal-400 flex items-center justify-center text-sm">📝</span>
              {editingItem ? "Edit Menu Item" : "Create Menu Item"}
            </h2>
            
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-white/70 uppercase tracking-widest text-[11px]">Item Name <span className="text-teal-400">*</span></label>
                <input type="text" placeholder="e.g. Nyama Choma" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-3.5 bg-black/30 border border-white/10 text-white rounded-xl focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all font-medium" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-white/70 uppercase tracking-widest text-[11px]">Price (KES) <span className="text-teal-400">*</span></label>
                  <input type="number" placeholder="500" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full p-3.5 bg-black/30 border border-white/10 text-white rounded-xl focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all font-medium" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-white/70 uppercase tracking-widest text-[11px]">Prep Time (Mins) <span className="text-teal-400">*</span></label>
                  <input type="number" placeholder="15" value={formData.prepTime} onChange={e => setFormData({...formData, prepTime: e.target.value})} className="w-full p-3.5 bg-black/30 border border-white/10 text-white rounded-xl focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all font-medium" />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-white/70 uppercase tracking-widest text-[11px]">Description</label>
                <textarea placeholder="Write a delicious description..." rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-3.5 bg-black/30 border border-white/10 text-white rounded-xl focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all font-medium resize-y" />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-white/70 uppercase tracking-widest text-[11px]">Product Image</label>
                <div className="flex gap-4 items-center">
                  {(uploadFile || formData.imageUrl) && (
                    <div className="relative group">
                      <img 
                        src={uploadFile ? URL.createObjectURL(uploadFile) : formData.imageUrl} 
                        className="w-20 h-20 rounded-xl object-cover border border-white/20 shadow-md" 
                        alt="Preview"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                        <span className="text-white text-xs font-bold">Change</span>
                      </div>
                    </div>
                  )}
                  <div className="flex-1 relative">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={e => setUploadFile(e.target.files?.[0] || null)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer text-[0]"
                    />
                    <div className="w-full p-4 border-2 border-dashed border-white/20 bg-white/5 rounded-xl text-center flex flex-col items-center justify-center gap-1 hover:border-teal-400/50 hover:bg-teal-400/5 transition-colors">
                       <span className="text-xl">📷</span>
                       <span className="font-semibold text-sm text-teal-400">Click to upload</span>
                       <span className="text-xs text-white/40">JPEG, PNG up to 5MB</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 mt-4 pt-4 border-t border-white/10">
                <button className="flex-1 py-3 px-4 rounded-xl border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-white font-bold transition-colors" onClick={handleCloseModal}>Cancel</button>
                <button 
                  className="flex-[2] py-3 px-4 rounded-xl bg-teal-400 hover:bg-teal-300 text-[#1a1026] font-bold transition-all shadow-lg shadow-teal-400/20 disabled:scale-100 disabled:opacity-70 disabled:cursor-not-allowed" 
                  onClick={handleSave} 
                  disabled={saveItemMutation.isPending || isUploading}
                >
                  {isUploading ? "Uploading Image..." : saveItemMutation.isPending ? "Saving..." : "Save Product"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
