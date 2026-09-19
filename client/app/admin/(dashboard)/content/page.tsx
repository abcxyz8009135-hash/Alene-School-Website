"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Check, Loader2, Upload } from "lucide-react";
import { adminFetch, adminUploadImage, AdminApiError } from "@/lib/adminApi";

type FieldType = "text" | "textarea" | "image";

interface FieldConfig {
  key: string;
  label: string;
  type: FieldType;
  placeholder?: string;
}

interface Section {
  title: string;
  description?: string;
  fields: FieldConfig[];
}

const SECTIONS: Section[] = [
  {
    title: "Branding",
    fields: [
      { key: "schoolName", label: "School Name", type: "text", placeholder: "Alene High School" },
      { key: "schoolShortName", label: "School Short Name", type: "text", placeholder: "Alene HS" },
      {
        key: "schoolMotto",
        label: "School Motto",
        type: "text",
        placeholder: "Knowledge. Character. Innovation.",
      },
      { key: "logoUrl", label: "Logo", type: "image" },
    ],
  },
  {
    title: "Home Page Hero Carousel",
    description: "The rotating banner at the top of the home page.",
    fields: [
      { key: "heroSlide1Image", label: "Slide 1 Image", type: "image" },
      { key: "heroSlide1Title", label: "Slide 1 Title", type: "text" },
      { key: "heroSlide1Subtitle", label: "Slide 1 Subtitle", type: "textarea" },
      { key: "heroSlide2Image", label: "Slide 2 Image", type: "image" },
      { key: "heroSlide2Title", label: "Slide 2 Title", type: "text" },
      { key: "heroSlide2Subtitle", label: "Slide 2 Subtitle", type: "textarea" },
      { key: "heroSlide3Image", label: "Slide 3 Image", type: "image" },
      { key: "heroSlide3Title", label: "Slide 3 Title", type: "text" },
      { key: "heroSlide3Subtitle", label: "Slide 3 Subtitle", type: "textarea" },
    ],
  },
  {
    title: "Page Hero Images",
    fields: [
      { key: "homeStemImage", label: "Home Page — STEM Showcase Image", type: "image" },
      { key: "aboutHeroImage", label: "About Us — Hero Image", type: "image" },
      { key: "hobbiesHeroImage", label: "Hobbies — Hero Image", type: "image" },
      { key: "stemHeroImage", label: "STEM Center — Hero Image", type: "image" },
    ],
  },
  {
    title: "STEM Center Gallery",
    description: "Six images shown in the STEM Center lab & robotics gallery.",
    fields: [
      { key: "stemGalleryImage1", label: "Gallery Image 1", type: "image" },
      { key: "stemGalleryImage2", label: "Gallery Image 2", type: "image" },
      { key: "stemGalleryImage3", label: "Gallery Image 3", type: "image" },
      { key: "stemGalleryImage4", label: "Gallery Image 4", type: "image" },
      { key: "stemGalleryImage5", label: "Gallery Image 5", type: "image" },
      { key: "stemGalleryImage6", label: "Gallery Image 6", type: "image" },
    ],
  },
  {
    title: "About Us — Story & Values",
    fields: [
      { key: "aboutHistoryParagraph1", label: "History — Paragraph 1", type: "textarea" },
      { key: "aboutHistoryParagraph2", label: "History — Paragraph 2", type: "textarea" },
      { key: "aboutMission", label: "Mission Statement", type: "textarea" },
      { key: "aboutVision", label: "Vision Statement", type: "textarea" },
      { key: "coreValue1Title", label: "Core Value 1 — Title", type: "text" },
      { key: "coreValue1Description", label: "Core Value 1 — Description", type: "textarea" },
      { key: "coreValue2Title", label: "Core Value 2 — Title", type: "text" },
      { key: "coreValue2Description", label: "Core Value 2 — Description", type: "textarea" },
      { key: "coreValue3Title", label: "Core Value 3 — Title", type: "text" },
      { key: "coreValue3Description", label: "Core Value 3 — Description", type: "textarea" },
      { key: "coreValue4Title", label: "Core Value 4 — Title", type: "text" },
      { key: "coreValue4Description", label: "Core Value 4 — Description", type: "textarea" },
    ],
  },
  {
    title: "About Us — Principal's Message",
    fields: [
      { key: "principalName", label: "Principal Name", type: "text" },
      { key: "principalTitle", label: "Principal Title", type: "text" },
      { key: "principalQuote", label: "Quote", type: "textarea" },
    ],
  },
  {
    title: "Contact Information",
    fields: [
      { key: "contactAddress", label: "Contact Address", type: "text" },
      { key: "contactPhone", label: "Contact Phone", type: "text" },
      { key: "contactEmail", label: "Contact Email", type: "text" },
      { key: "contactHours", label: "Office Hours", type: "text" },
    ],
  },
  {
    title: "Social Links",
    fields: [
      { key: "facebookUrl", label: "Facebook URL", type: "text" },
      { key: "instagramUrl", label: "Instagram URL", type: "text" },
      { key: "youtubeUrl", label: "YouTube URL", type: "text" },
    ],
  },
];

type SectionStatus = {
  saving: boolean;
  error: string | null;
  success: string | null;
};

const IDLE_STATUS: SectionStatus = { saving: false, error: null, success: null };

export default function AdminContentPage() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [sectionStatus, setSectionStatus] = useState<Record<string, SectionStatus>>({});

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await adminFetch("/settings");
        setValues(data.settings || {});
      } catch (err) {
        setLoadError(err instanceof Error ? err.message : "Failed to load settings.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleImageSelect(key: string, e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setUploadingKey(key);
    try {
      const url = await adminUploadImage(file);
      setValues((v) => ({ ...v, [key]: url }));
    } catch (err) {
      alert(err instanceof AdminApiError ? err.message : "Image upload failed.");
    } finally {
      setUploadingKey(null);
    }
  }

  function getStatus(title: string): SectionStatus {
    return sectionStatus[title] || IDLE_STATUS;
  }

  async function handleApplySection(e: FormEvent, section: Section) {
    e.preventDefault();
    setSectionStatus((s) => ({
      ...s,
      [section.title]: { saving: true, error: null, success: null },
    }));

    const payload: Record<string, string> = {};
    for (const field of section.fields) {
      payload[field.key] = values[field.key] || "";
    }

    try {
      const data = await adminFetch("/admin/settings", {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      setValues((v) => ({ ...v, ...(data.settings || payload) }));
      setSectionStatus((s) => ({
        ...s,
        [section.title]: { saving: false, error: null, success: "Saved." },
      }));
    } catch (err) {
      setSectionStatus((s) => ({
        ...s,
        [section.title]: {
          saving: false,
          error: err instanceof Error ? err.message : "Failed to save.",
          success: null,
        },
      }));
    }
  }

  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold text-ink-900">Site Content</h1>
        <p className="mt-1 text-sm text-ink-500">
          Manage sitewide branding, hero images, and page copy shown across the site. Each
          section saves independently — apply just the section you&apos;ve changed.
        </p>
      </div>

      {loading ? (
        <div className="mt-10 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-brand-600" />
        </div>
      ) : loadError ? (
        <p className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 ring-1 ring-inset ring-red-200">
          {loadError}
        </p>
      ) : (
        <div className="mt-6 max-w-3xl space-y-6">
          {SECTIONS.map((section) => {
            const status = getStatus(section.title);
            return (
              <form
                key={section.title}
                onSubmit={(e) => handleApplySection(e, section)}
                className="card p-6"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-ink-900">{section.title}</h2>
                    {section.description && (
                      <p className="mt-1 text-xs text-ink-400">{section.description}</p>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={status.saving}
                    className="btn-primary shrink-0"
                  >
                    {status.saving ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Check className="h-3.5 w-3.5" />
                    )}
                    Apply
                  </button>
                </div>

                <div className="mt-4 space-y-4">
                  {section.fields.map((field) => (
                    <div key={field.key}>
                      <label className="form-label">{field.label}</label>
                      {field.type === "image" ? (
                        <div className="flex items-center gap-3">
                          <label className="btn-icon cursor-pointer">
                            {uploadingKey === field.key ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Upload className="h-3.5 w-3.5" />
                            )}
                            Upload
                            <input
                              type="file"
                              accept="image/jpeg,image/png,image/webp,image/gif"
                              className="hidden"
                              disabled={uploadingKey === field.key}
                              onChange={(e) => handleImageSelect(field.key, e)}
                            />
                          </label>
                          {values[field.key] && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={values[field.key]}
                              alt={field.label}
                              className="h-10 w-10 rounded-lg object-cover ring-1 ring-inset ring-slate-200"
                            />
                          )}
                          <input
                            value={values[field.key] || ""}
                            onChange={(e) =>
                              setValues((v) => ({ ...v, [field.key]: e.target.value }))
                            }
                            className="input-field flex-1"
                            placeholder="or paste an image URL"
                          />
                        </div>
                      ) : field.type === "textarea" ? (
                        <textarea
                          rows={3}
                          value={values[field.key] || ""}
                          onChange={(e) =>
                            setValues((v) => ({ ...v, [field.key]: e.target.value }))
                          }
                          className="input-field resize-none"
                          placeholder={field.placeholder}
                        />
                      ) : (
                        <input
                          value={values[field.key] || ""}
                          onChange={(e) =>
                            setValues((v) => ({ ...v, [field.key]: e.target.value }))
                          }
                          className="input-field"
                          placeholder={field.placeholder}
                        />
                      )}
                    </div>
                  ))}
                </div>

                {status.error && (
                  <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 ring-1 ring-inset ring-red-200">
                    {status.error}
                  </p>
                )}
                {status.success && (
                  <p className="mt-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-600 ring-1 ring-inset ring-emerald-200">
                    {status.success}
                  </p>
                )}
              </form>
            );
          })}
        </div>
      )}
    </div>
  );
}
