"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { TextField, Label, TextArea, Button } from "@heroui/react";
import { authClient } from "@/lib/auth-client";

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
          <button type="button" onClick={onClose} className="rounded-full p-1.5 text-[#94A3B8] hover:bg-[#F1F5F9] hover:text-[#0F172A]" aria-label="Close">
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
  const { data: session, isPending: isSessionPending } = authClient.useSession();

  const [reviews, setReviews] = useState([]);
  const [completedAppointments, setCompletedAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isAdding, setIsAdding] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [rating, setRating] = useState(5);
  const [selectedDoctorId, setSelectedDoctorId] = useState("");

  useEffect(() => {
    if (!session?.user?.id) return;

    const load = async () => {
      try {
        const [reviewsRes, appointmentsRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews/patient/${session.user.id}`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/appointments/patient/${session.user.id}`),
        ]);

        const reviewsData = await reviewsRes.json();
        const appointmentsData = await appointmentsRes.json();

        setReviews(Array.isArray(reviewsData) ? reviewsData : []);
        setCompletedAppointments(
          Array.isArray(appointmentsData)
            ? appointmentsData.filter((a) => a.status === "completed")
            : []
        );
      } catch (err) {
        console.error("Failed to load reviews page data:", err);
        setReviews([]);
        setCompletedAppointments([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [session]);

  const reviewableDoctors = useMemo(() => {
    const reviewedDoctorIds = new Set(reviews.map((r) => r.doctorId));
    const seen = new Map();

    for (const apt of completedAppointments) {
      if (!apt.doctor?._id && !apt.doctorId) continue;
      const doctorId = apt.doctorId;
      if (reviewedDoctorIds.has(doctorId) || seen.has(doctorId)) continue;
      seen.set(doctorId, {
        appointmentId: apt._id.toString(),
        doctorId,
        name: apt.doctor?.name,
        photoUrl: apt.doctor?.photoUrl,
      });
    }

    return Array.from(seen.values());
  }, [completedAppointments, reviews]);

  const openAdd = () => {
    setRating(5);
    setSelectedDoctorId(reviewableDoctors[0]?.doctorId || "");
    setIsAdding(true);
  };

  const openEdit = (review) => {
    setRating(review.rating);
    setEditTarget(review);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const selectedDoctor = reviewableDoctors.find(
      (d) => d.doctorId === formData.get("doctorId")
    );

    const newReview = {
      appointmentId: selectedDoctor?.appointmentId,
      patientId: session.user.id,
      doctorId: selectedDoctor?.doctorId,
      rating,
      comment: formData.get("comment"),
    };

    console.log(newReview);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReview),
      });
      const result = await res.json();

      console.log("Review submitted successfully:", result);

      const doctor = reviewableDoctors.find((d) => d.doctorId === newReview.doctorId);
      setReviews((prev) => [
        {
          ...newReview,
          _id: result.insertedId.toString(),
          doctorName: doctor?.name,
          doctorPhoto: doctor?.photoUrl,
          createdAt: new Date(),
        },
        ...prev,
      ]);
      setIsAdding(false);
    } catch (err) {
      console.error("Failed to submit review:", err);
      alert("Something went wrong submitting your review.");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const updated = { rating, comment: formData.get("comment") };

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews/${editTarget._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });

      setReviews((prev) => prev.map((r) => (r._id === editTarget._id ? { ...r, ...updated } : r)));
      setEditTarget(null);
    } catch (err) {
      console.error("Failed to update review:", err);
    }
  };

  const handleDelete = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews/${deleteTarget._id}`, {
        method: "DELETE",
      });
      setReviews((prev) => prev.filter((r) => r._id !== deleteTarget._id));
      setDeleteTarget(null);
    } catch (err) {
      console.error("Failed to delete review:", err);
    }
  };

  if (isSessionPending || loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#E2E8F0] border-t-[#2563EB]" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A] sm:text-3xl">My Reviews</h1>
          <p className="mt-1 text-sm text-[#64748B]">
            Share feedback on doctors after your visit is completed.
          </p>
        </div>
        <button
          onClick={openAdd}
          disabled={reviewableDoctors.length === 0}
          className="inline-flex w-fit items-center gap-2 rounded-full bg-[#2563EB] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14" />
            <path d="M5 12h14" />
          </svg>
          Add Review
        </button>
      </div>

      {reviewableDoctors.length === 0 && (
        <div className="flex items-center gap-2 rounded-xl border border-[#BFDBFE] bg-[#EFF6FF] px-4 py-3 text-sm text-[#1D4ED8]">
          <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8v4" />
            <path d="M12 16h.01" />
          </svg>
          You can review a doctor once your visit is marked completed.
        </div>
      )}

      <div className="flex flex-col gap-4">
        {reviews.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#CBD5E1] bg-white p-10 text-center text-sm text-[#94A3B8]">
            You haven&apos;t written any reviews yet.
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-[#F1F5F9]">
                    <Image
                      src={review.doctorPhoto || "https://i.pravatar.cc/150?u=" + review.doctorId}
                      alt={review.doctorName || "Doctor"}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#0F172A]">{review.doctorName}</p>
                    <p className="text-xs text-[#94A3B8]">
                      {review.specialty || ""}
                      {review.specialty ? " · " : ""}
                      {review.createdAt ? new Date(review.createdAt).toLocaleDateString("en-GB") : ""}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-1">
                  <button onClick={() => openEdit(review)} className="rounded-lg p-1.5 text-[#94A3B8] hover:bg-[#F1F5F9] hover:text-[#2563EB]" aria-label="Edit review">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
                    </svg>
                  </button>
                  <button onClick={() => setDeleteTarget(review)} className="rounded-lg p-1.5 text-[#94A3B8] hover:bg-[#FEF2F2] hover:text-[#EF4444]" aria-label="Delete review">
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

      {isAdding && (
        <Modal title="Add Review" onClose={() => setIsAdding(false)}>
          <form onSubmit={handleAdd} className="flex flex-col gap-5">
            <div>
              <Label className="text-sm font-medium text-[#334155]">Doctor</Label>
              <select
                name="doctorId"
                required
                value={selectedDoctorId}
                onChange={(e) => setSelectedDoctorId(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm text-[#0F172A] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
              >
                {reviewableDoctors.map((d) => (
                  <option key={d.doctorId} value={d.doctorId}>
                    {d.name}
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
              <button type="button" onClick={() => setIsAdding(false)} className="flex-1 rounded-full border border-[#E2E8F0] py-2.5 text-sm font-semibold text-[#334155]">
                Cancel
              </button>
              <Button type="submit" className="flex-1 rounded-full bg-[#2563EB] py-2.5 text-sm font-bold text-white hover:bg-[#1D4ED8]">
                Submit Review
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {editTarget && (
        <Modal title="Edit Review" onClose={() => setEditTarget(null)}>
          <p className="text-sm text-[#64748B]">
            Editing your review for <span className="font-semibold text-[#0F172A]">{editTarget.doctorName}</span>
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
                className="mt-1.5 w-full resize-none rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm text-[#0F172A] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
              />
            </TextField>

            <div className="mt-1 flex gap-3">
              <button type="button" onClick={() => setEditTarget(null)} className="flex-1 rounded-full border border-[#E2E8F0] py-2.5 text-sm font-semibold text-[#334155]">
                Cancel
              </button>
              <Button type="submit" className="flex-1 rounded-full bg-[#2563EB] py-2.5 text-sm font-bold text-white hover:bg-[#1D4ED8]">
                Save Changes
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {deleteTarget && (
        <Modal title="Delete Review" onClose={() => setDeleteTarget(null)}>
          <p className="text-sm text-[#64748B]">
            Are you sure you want to delete your review for{" "}
            <span className="font-semibold text-[#0F172A]">{deleteTarget.doctorName}</span>? This can&apos;t be undone.
          </p>
          <div className="mt-6 flex gap-3">
            <button type="button" onClick={() => setDeleteTarget(null)} className="flex-1 rounded-full border border-[#E2E8F0] py-2.5 text-sm font-semibold text-[#334155]">
              Keep Review
            </button>
            <button type="button" onClick={handleDelete} className="flex-1 rounded-full bg-[#EF4444] py-2.5 text-sm font-bold text-white hover:bg-[#DC2626]">
              Yes, Delete
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}