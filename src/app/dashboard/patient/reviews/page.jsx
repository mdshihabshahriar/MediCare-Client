"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { TextField, Label, TextArea, Button } from "@heroui/react";
import { authClient } from "@/lib/auth-client";

function StarPicker({ value, onChange }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < value;
        return (
          <motion.button
            key={i}
            type="button"
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onChange(i + 1)}
            className="text-[#F59E0B]"
            aria-label={`${i + 1} star`}
          >
            <svg className="h-7 w-7" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5">
              <path d="m12 2.5 2.9 6 6.6.9-4.8 4.6 1.1 6.5-5.8-3.1-5.8 3.1 1.1-6.5-4.8-4.6 6.6-.9L12 2.5Z" />
            </svg>
          </motion.button>
        );
      })}
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="w-full max-w-md rounded-2xl bg-base-100 p-6 shadow-xl"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-base-content">{title}</h3>
          <button type="button" onClick={onClose} className="rounded-full p-1.5 text-base-content/50 hover:bg-base-200 hover:text-base-content" aria-label="Close">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>
        <div className="mt-5">{children}</div>
      </motion.div>
    </motion.div>
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
    document.title = "My Reviews | MediCare";
  }, []);

  useEffect(() => {
    if (!session?.user?.id) return;

    const load = async () => {
      try {
        const { data: tokenData } = await authClient.token();
        const authHeader = { authorization: `Bearer ${tokenData?.token}` };
        const [reviewsRes, appointmentsRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews/patient/${session.user.id}`,{
              headers: authHeader,
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/appointments/patient/${session.user.id}`,{
              headers: authHeader,
          }),
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
      const { data: tokenData } = await authClient.token();

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json", authorization: `Bearer ${tokenData?.token}` },
        body: JSON.stringify(newReview),
      });
      const result = await res.json();

      // console.log("Review submitted successfully:", result);

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
      const { data: tokenData } = await authClient.token();
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews/${editTarget._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", authorization: `Bearer ${tokenData?.token}` },
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
      const { data: tokenData } = await authClient.token();
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews/${deleteTarget._id}`, {
        method: "DELETE",
        headers: { authorization: `Bearer ${tokenData?.token}` },
      });
      setReviews((prev) => prev.filter((r) => r._id !== deleteTarget._id));
      setDeleteTarget(null);
    } catch (err) {
      console.error("Failed to delete review:", err);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
  };

  if (isSessionPending || loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
          className="h-8 w-8 rounded-full border-2 border-base-300 border-t-primary"
        />
      </div>
    );
  }

  return (
    <motion.div
      className="flex flex-col gap-6"
      initial="hidden"
      animate="show"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-base-content sm:text-3xl">My Reviews</h1>
          <p className="mt-1 text-sm text-base-content/60">
            Share feedback on doctors after your visit is completed.
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={openAdd}
          disabled={reviewableDoctors.length === 0}
          className="inline-flex w-fit items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14" />
            <path d="M5 12h14" />
          </svg>
          Add Review
        </motion.button>
      </motion.div>

      {reviewableDoctors.length === 0 && (
        <motion.div variants={itemVariants} className="flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary">
          <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8v4" />
            <path d="M12 16h.01" />
          </svg>
          You can review a doctor once your visit is marked completed.
        </motion.div>
      )}

      <motion.div className="flex flex-col gap-4" variants={containerVariants}>
        {reviews.length === 0 ? (
          <motion.div variants={itemVariants} className="rounded-2xl border border-dashed border-base-300 bg-base-100 p-10 text-center text-sm text-base-content/50">
            You haven&apos;t written any reviews yet.
          </motion.div>
        ) : (
          <AnimatePresence>
            {reviews.map((review) => (
              <motion.div
                key={review._id}
                variants={itemVariants}
                initial="hidden"
                animate="show"
                exit={{ opacity: 0, x: -12, transition: { duration: 0.2 } }}
                className="rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-base-200">
                      <Image
                        src={review.doctorPhoto || "https://i.pravatar.cc/150?u=" + review.doctorId}
                        alt={review.doctorName || "Doctor"}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-base-content">{review.doctorName}</p>
                      <p className="text-xs text-base-content/50">
                        {review.specialty || ""}
                        {review.specialty ? " · " : ""}
                        {review.createdAt ? new Date(review.createdAt).toLocaleDateString("en-GB") : ""}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-1">
                    <button onClick={() => openEdit(review)} className="rounded-lg p-1.5 text-base-content/50 hover:bg-base-200 hover:text-primary" aria-label="Edit review">
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 20h9" />
                        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
                      </svg>
                    </button>
                    <button onClick={() => setDeleteTarget(review)} className="rounded-lg p-1.5 text-base-content/50 hover:bg-red-50 hover:text-[#EF4444]" aria-label="Delete review">
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

                <p className="mt-3 text-sm leading-relaxed text-base-content/80">{review.comment}</p>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </motion.div>

      <AnimatePresence>
        {isAdding && (
          <Modal title="Add Review" onClose={() => setIsAdding(false)}>
            <form onSubmit={handleAdd} className="flex flex-col gap-5">
              <div>
                <Label className="text-sm font-medium text-base-content/80">Doctor</Label>
                <select
                  name="doctorId"
                  required
                  value={selectedDoctorId}
                  onChange={(e) => setSelectedDoctorId(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-base-300 bg-base-100 px-4 py-2.5 text-sm text-base-content outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  {reviewableDoctors.map((d) => (
                    <option key={d.doctorId} value={d.doctorId}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label className="text-sm font-medium text-base-content/80">Rating</Label>
                <div className="mt-1.5">
                  <StarPicker value={rating} onChange={setRating} />
                </div>
              </div>

              <TextField name="comment" isRequired>
                <Label className="text-sm font-medium text-base-content/80">Your Review</Label>
                <TextArea
                  rows={4}
                  placeholder="Share your experience..."
                  className="mt-1.5 w-full resize-none rounded-xl border border-base-300 bg-base-100 px-4 py-2.5 text-sm text-base-content outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </TextField>

              <div className="mt-1 flex gap-3">
                <button type="button" onClick={() => setIsAdding(false)} className="flex-1 rounded-full border border-base-300 py-2.5 text-sm font-semibold text-base-content/80">
                  Cancel
                </button>
                <Button type="submit" className="flex-1 rounded-full bg-primary py-2.5 text-sm font-bold text-white hover:bg-primary/90">
                  Submit Review
                </Button>
              </div>
            </form>
          </Modal>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editTarget && (
          <Modal title="Edit Review" onClose={() => setEditTarget(null)}>
            <p className="text-sm text-base-content/60">
              Editing your review for <span className="font-semibold text-base-content">{editTarget.doctorName}</span>
            </p>
            <form onSubmit={handleUpdate} className="mt-4 flex flex-col gap-5">
              <div>
                <Label className="text-sm font-medium text-base-content/80">Rating</Label>
                <div className="mt-1.5">
                  <StarPicker value={rating} onChange={setRating} />
                </div>
              </div>

              <TextField name="comment" defaultValue={editTarget.comment} isRequired>
                <Label className="text-sm font-medium text-base-content/80">Your Review</Label>
                <TextArea
                  rows={4}
                  className="mt-1.5 w-full resize-none rounded-xl border border-base-300 bg-base-100 px-4 py-2.5 text-sm text-base-content outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </TextField>

              <div className="mt-1 flex gap-3">
                <button type="button" onClick={() => setEditTarget(null)} className="flex-1 rounded-full border border-base-300 py-2.5 text-sm font-semibold text-base-content/80">
                  Cancel
                </button>
                <Button type="submit" className="flex-1 rounded-full bg-primary py-2.5 text-sm font-bold text-white hover:bg-primary/90">
                  Save Changes
                </Button>
              </div>
            </form>
          </Modal>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteTarget && (
          <Modal title="Delete Review" onClose={() => setDeleteTarget(null)}>
            <p className="text-sm text-base-content/60">
              Are you sure you want to delete your review for{" "}
              <span className="font-semibold text-base-content">{deleteTarget.doctorName}</span>? This can&apos;t be undone.
            </p>
            <div className="mt-6 flex gap-3">
              <button type="button" onClick={() => setDeleteTarget(null)} className="flex-1 rounded-full border border-base-300 py-2.5 text-sm font-semibold text-base-content/80">
                Keep Review
              </button>
              <button type="button" onClick={handleDelete} className="flex-1 rounded-full bg-[#EF4444] py-2.5 text-sm font-bold text-white hover:bg-[#DC2626]">
                Yes, Delete
              </button>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </motion.div>
  );
}