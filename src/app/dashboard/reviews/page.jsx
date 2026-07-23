"use client";

import { useState } from "react";
import Image from "next/image";
import { TextField, Label, TextArea, Button } from "@heroui/react";

const initialReviews = [
  {
    id: "1",
    doctor: "Dr. Amanda Ross",
    specialization: "Cardiology",
    photo: "https://i.pravatar.cc/150?img=44",
    rating: 5,
    comment:
      "Dr. Ross saved my father's life. Her precision and clear explanations made a stressful surgery very manageable.",
    date: "2026-06-16",
  },
  {
    id: "2",
    doctor: "Dr. James Wilson",
    specialization: "Orthopedics",
    photo: "https://i.pravatar.cc/150?img=53",
    rating: 4,
    comment: "Very thorough during the consultation, though the wait time was a bit long.",
    date: "2026-06-01",
  },
];

const doctorOptions = [
  "Dr. Amanda Ross",
  "Dr. Michael Chen",
  "Dr. Amara Rahman",
  "Dr. James Wilson",
];

function StarPicker({ value, onChange }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < value;
        return (
          <button
            key={i}
            type="button"
            onClick={() => onChange(i + 1)}
            className="text-[#F59E0B]"
            aria-label={`${i + 1} star`}
          >
            <svg className="h-7 w-7" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5">
              <path d="m12 2.5 2.9 6 6.6.9-4.8 4.6 1.1 6.5-5.8-3.1-5.8 3.1 1.1-6.5-4.8-4.6 6.6-.9L12 2.5Z" />
            </svg>
          </button>
        );
      })}
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-[#0F172A]">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-[#94A3B8] hover:bg-[#F1F5F9] hover:text-[#0F172A]"
            aria-label="Close"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>
        <div className="mt-5">{children}</div>
      </div>
    </div>
  );
}

export default function MyReviews() {
  const [reviews, setReviews] = useState(initialReviews);
  const [isAdding, setIsAdding] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [rating, setRating] = useState(5);

  const openAdd = () => {
    setRating(5);
    setIsAdding(true);
  };

  const openEdit = (review) => {
    setRating(review.rating);
    setEditTarget(review);
  };

  const handleAdd = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const newReview = {
      id: crypto.randomUUID(),
      doctor: formData.get("doctor"),
      specialization: "—",
      photo: "https://i.pravatar.cc/150?img=68",
      rating,
      comment: formData.get("comment"),
      date: new Date().toISOString().slice(0, 10),
    };

    // TODO: POST `newReview` to your API, then update state with the response.
    setReviews((prev) => [newReview, ...prev]);
    setIsAdding(false);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    // TODO: PATCH the review on your API.
    setReviews((prev) =>
      prev.map((r) =>
        r.id === editTarget.id ? { ...r, rating, comment: formData.get("comment") } : r
      )
    );
    setEditTarget(null);
  };

  const handleDelete = () => {
    // TODO: DELETE the review on your API.
    setReviews((prev) => prev.filter((r) => r.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A] sm:text-3xl">My Reviews</h1>
          <p className="mt-1 text-sm text-[#64748B]">
            Share feedback on the doctors you&apos;ve consulted with.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex w-fit items-center gap-2 rounded-full bg-[#2563EB] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#1D4ED8]"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14" />
            <path d="M5 12h14" />
          </svg>
          Add Review
        </button>
      </div>

      {/* Reviews list */}
      <div className="flex flex-col gap-4">
        {reviews.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#CBD5E1] bg-white p-10 text-center text-sm text-[#94A3B8]">
            You haven&apos;t written any reviews yet.
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full">
                    <Image src={review.photo} alt={review.doctor} fill className="object-cover" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#0F172A]">{review.doctor}</p>
                    <p className="text-xs text-[#94A3B8]">{review.specialization} · {review.date}</p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-1">
                  <button
                    onClick={() => openEdit(review)}
                    className="rounded-lg p-1.5 text-[#94A3B8] hover:bg-[#F1F5F9] hover:text-[#2563EB]"
                    aria-label="Edit review"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setDeleteTarget(review)}
                    className="rounded-lg p-1.5 text-[#94A3B8] hover:bg-[#FEF2F2] hover:text-[#EF4444]"
                    aria-label="Delete review"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 6h18" />
                      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="mt-3 flex gap-0.5 text-[#F59E0B]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} className="h-4 w-4" viewBox="0 0 24 24" fill={i < review.rating ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5">
                    <path d="m12 2.5 2.9 6 6.6.9-4.8 4.6 1.1 6.5-5.8-3.1-5.8 3.1 1.1-6.5-4.8-4.6 6.6-.9L12 2.5Z" />
                  </svg>
                ))}
              </div>

              <p className="mt-3 text-sm leading-relaxed text-[#334155]">{review.comment}</p>
            </div>
          ))
        )}
      </div>

      {/* Add modal */}
      {isAdding && (
        <Modal title="Add Review" onClose={() => setIsAdding(false)}>
          <form onSubmit={handleAdd} className="flex flex-col gap-5">
            <div>
              <Label className="text-sm font-medium text-[#334155]">Doctor</Label>
              <select
                name="doctor"
                required
                defaultValue=""
                className="mt-1.5 w-full rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm text-[#0F172A] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
              >
                <option value="" disabled>
                  Select a doctor
                </option>
                {doctorOptions.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label className="text-sm font-medium text-[#334155]">Rating</Label>
              <div className="mt-1.5">
                <StarPicker value={rating} onChange={setRating} />
              </div>
            </div>

            <TextField name="comment" isRequired>
              <Label className="text-sm font-medium text-[#334155]">Your Review</Label>
              <TextArea
                rows={4}
                placeholder="Share your experience..."
                className="mt-1.5 w-full resize-none rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm text-[#0F172A] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
              />
            </TextField>

            <div className="mt-1 flex gap-3">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="flex-1 rounded-full border border-[#E2E8F0] py-2.5 text-sm font-semibold text-[#334155]"
              >
                Cancel
              </button>
              <Button type="submit" className="flex-1 rounded-full bg-[#2563EB] py-2.5 text-sm font-bold text-white hover:bg-[#1D4ED8]">
                Submit Review
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Edit modal */}
      {editTarget && (
        <Modal title="Edit Review" onClose={() => setEditTarget(null)}>
          <p className="text-sm text-[#64748B]">
            Editing your review for <span className="font-semibold text-[#0F172A]">{editTarget.doctor}</span>
          </p>
          <form onSubmit={handleUpdate} className="mt-4 flex flex-col gap-5">
            <div>
              <Label className="text-sm font-medium text-[#334155]">Rating</Label>
              <div className="mt-1.5">
                <StarPicker value={rating} onChange={setRating} />
              </div>
            </div>

            <TextField name="comment" defaultValue={editTarget.comment} isRequired>
              <Label className="text-sm font-medium text-[#334155]">Your Review</Label>
              <TextArea
                rows={4}
                defaultValue={editTarget.comment}
                className="mt-1.5 w-full resize-none rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm text-[#0F172A] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
              />
            </TextField>

            <div className="mt-1 flex gap-3">
              <button
                type="button"
                onClick={() => setEditTarget(null)}
                className="flex-1 rounded-full border border-[#E2E8F0] py-2.5 text-sm font-semibold text-[#334155]"
              >
                Cancel
              </button>
              <Button type="submit" className="flex-1 rounded-full bg-[#2563EB] py-2.5 text-sm font-bold text-white hover:bg-[#1D4ED8]">
                Save Changes
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete confirm modal */}
      {deleteTarget && (
        <Modal title="Delete Review" onClose={() => setDeleteTarget(null)}>
          <p className="text-sm text-[#64748B]">
            Are you sure you want to delete your review for{" "}
            <span className="font-semibold text-[#0F172A]">{deleteTarget.doctor}</span>? This can&apos;t be undone.
          </p>
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={() => setDeleteTarget(null)}
              className="flex-1 rounded-full border border-[#E2E8F0] py-2.5 text-sm font-semibold text-[#334155]"
            >
              Keep Review
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="flex-1 rounded-full bg-[#EF4444] py-2.5 text-sm font-bold text-white hover:bg-[#DC2626]"
            >
              Yes, Delete
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}