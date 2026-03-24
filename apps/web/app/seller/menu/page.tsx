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

  if (isLoading) return <p style={{ padding: "2rem" }}>Loading Catalog Engine...</p>;

  return (
    <main className="dashboard-content" style={{ padding: "1rem" }}>
      <header className="dashboard-header" style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <p className="eyebrow">Catalog</p>
          <h1 style={{ margin: "0.2rem 0" }}>Menu Management</h1>
          <p style={{ color: "rgba(255,255,255,0.6)", margin: 0 }}>Organize your offerings, adjust prep times, and toggle availability.</p>
        </div>
        <button className="primary" onClick={() => handleOpenModal()}>+ Add New Item</button>
      </header>

      {selectedItems.size > 0 && (
        <div style={{ background: "#7C5CFF", padding: "1rem 1.5rem", borderRadius: "12px", marginBottom: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <span style={{ fontWeight: 600 }}>{selectedItems.size} items selected</span>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <button className="base" style={{ background: "#2dd4bf", color: "#1a1026", border: "none", padding: "0.6rem 1.2rem", fontWeight: "bold" }} onClick={() => toggleBulkMutation.mutate({ productIds: Array.from(selectedItems), isActive: true })} disabled={toggleBulkMutation.isPending}>Set Active</button>
            <button className="base" style={{ background: "rgba(0,0,0,0.4)", color: "white", border: "none", padding: "0.6rem 1.2rem", fontWeight: "bold" }} onClick={() => toggleBulkMutation.mutate({ productIds: Array.from(selectedItems), isActive: false })} disabled={toggleBulkMutation.isPending}>Set Inactive</button>
          </div>
        </div>
      )}

      <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: "12px", overflowX: "auto" }}>
        <table style={{ width: "100%", minWidth: "600px", textAlign: "left", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              <th style={{ padding: "1.2rem", width: "50px" }}>Select</th>
              <th style={{ padding: "1.2rem" }}>Item Name</th>
              <th style={{ padding: "1.2rem" }}>Price (KES)</th>
              <th style={{ padding: "1.2rem" }}>Prep Time</th>
              <th style={{ padding: "1.2rem" }}>Status</th>
              <th style={{ padding: "1.2rem", textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {menu.map((item: any) => (
              <tr key={item.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", background: selectedItems.has(item.id) ? "rgba(124, 92, 255, 0.1)" : "transparent" }}>
                <td style={{ padding: "1.2rem" }}>
                  <input type="checkbox" checked={selectedItems.has(item.id)} onChange={() => handleSelect(item.id)} style={{ width: "18px", height: "18px", accentColor: "#7C5CFF" }} />
                </td>
                <td style={{ padding: "1.2rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} style={{ width: "40px", height: "40px", borderRadius: "8px", objectFit: "cover" }} />
                    ) : (
                      <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem", color: "rgba(255,255,255,0.5)" }}>No Img</div>
                    )}
                    <div>
                      <strong style={{ display: "block", color: "#fff" }}>{item.name}</strong>
                      {item.description && <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)" }}>{item.description.substring(0, 40)}{item.description.length > 40 ? '...' : ''}</span>}
                    </div>
                  </div>
                </td>
                <td style={{ padding: "1.2rem", fontWeight: 600, color: "#2dd4bf" }}>KES {item.price}</td>
                <td style={{ padding: "1.2rem", color: "rgba(255,255,255,0.8)" }}>{item.prepTime} mins</td>
                <td style={{ padding: "1.2rem" }}>
                  <span style={{ 
                    padding: "0.3rem 0.6rem", borderRadius: "6px", fontSize: "0.75rem", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.05em",
                    background: item.isActive ? "rgba(45,212,191,0.15)" : "rgba(255,255,255,0.1)",
                    color: item.isActive ? "#2dd4bf" : "rgba(255,255,255,0.4)",
                    border: `1px solid ${item.isActive ? "rgba(45,212,191,0.3)" : "transparent"}`
                  }}>
                    {item.isActive ? "Active" : "Disabled"}
                  </span>
                </td>
                <td style={{ padding: "1.2rem", textAlign: "right" }}>
                  <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
                    <button className="ghost" style={{ padding: "0.4rem 0.8rem", fontSize: "0.85rem", background: "rgba(255,255,255,0.1)", color: "white" }} onClick={() => handleOpenModal(item)}>Edit</button>
                    <button className="ghost" style={{ padding: "0.4rem 0.8rem", fontSize: "0.85rem", background: "rgba(255,78,80,0.1)", color: "#ff4e50" }} onClick={() => deleteItemMutation.mutate(item.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {menu.length === 0 && !isLoading && (
              <tr>
                <td colSpan={6} style={{ padding: "3rem 1rem", textAlign: "center", color: "rgba(255,255,255,0.5)" }}>
                  Your menu is currently empty. Click "Add New Item" to create your first product.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div className="modal-card" style={{ background: "#1a1026", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px", padding: "2rem", width: "90%", maxWidth: "500px", maxHeight: "90vh", overflowY: "auto" }}>
            <h2 style={{ margin: "0 0 1.5rem" }}>{editingItem ? "Edit Menu Item" : "Create Menu Item"}</h2>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "rgba(255,255,255,0.6)", marginBottom: "0.5rem" }}>Item Name *</label>
                <input type="text" placeholder="e.g. Nyama Choma" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ width: "100%", padding: "0.8rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "white", borderRadius: "8px", fontSize: "1rem" }} />
              </div>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", color: "rgba(255,255,255,0.6)", marginBottom: "0.5rem" }}>Price (KES) *</label>
                  <input type="number" placeholder="500" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} style={{ width: "100%", padding: "0.8rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "white", borderRadius: "8px", fontSize: "1rem" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", color: "rgba(255,255,255,0.6)", marginBottom: "0.5rem" }}>Prep Time (Mins) *</label>
                  <input type="number" placeholder="15" value={formData.prepTime} onChange={e => setFormData({...formData, prepTime: e.target.value})} style={{ width: "100%", padding: "0.8rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "white", borderRadius: "8px", fontSize: "1rem" }} />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "rgba(255,255,255,0.6)", marginBottom: "0.5rem" }}>Description</label>
                <textarea placeholder="Write a delicious description..." rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} style={{ width: "100%", padding: "0.8rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "white", borderRadius: "8px", fontSize: "1rem", resize: "vertical" }} />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "rgba(255,255,255,0.6)", marginBottom: "0.5rem" }}>Product Image</label>
                <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                  {(uploadFile || formData.imageUrl) && (
                    <img 
                      src={uploadFile ? URL.createObjectURL(uploadFile) : formData.imageUrl} 
                      style={{ width: "60px", height: "60px", borderRadius: "8px", objectFit: "cover", border: "1px solid rgba(255,255,255,0.2)" }} 
                      alt="Preview"
                    />
                  )}
                  <div style={{ flex: 1, position: "relative" }}>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={e => setUploadFile(e.target.files?.[0] || null)}
                      style={{ 
                        width: "100%", padding: "0.8rem", background: "rgba(255,255,255,0.05)", border: "1px dashed rgba(255,255,255,0.2)", 
                        color: "white", borderRadius: "8px", fontSize: "0.8rem" 
                      }} 
                    />
                  </div>
                </div>
                <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", marginTop: "0.4rem" }}>Securely stored and optimized for the menu feed.</p>
              </div>
              
              <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                <button className="base" style={{ flex: 1, background: "transparent", color: "white", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "8px", padding: "0.8rem" }} onClick={handleCloseModal}>Cancel</button>
                <button className="primary" style={{ flex: 1, borderRadius: "8px", padding: "0.8rem", opacity: (saveItemMutation.isPending || isUploading) ? 0.7 : 1 }} onClick={handleSave} disabled={saveItemMutation.isPending || isUploading}>
                  {isUploading ? "Uploading..." : saveItemMutation.isPending ? "Saving..." : "Save Product"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
