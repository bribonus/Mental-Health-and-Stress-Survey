import { useRef, useState, useEffect } from "react";
import { Link } from "wouter";
import { supabase, SurveyResponse } from "@/lib/supabaseClient";
import Footer from "@/components/Footer";

const STRESS_SOURCES = [
  "Academic workload",
  "Exams/tests",
  "Financial concerns",
  "Social life",
  "Family expectations",
  "Health problems",
  "Time management",
  "Post-grad employment",
  "Other",
];

const COPING_METHODS = [
  "Exercise",
  "Talking to friends/family",
  "Watching TV/streaming",
  "Sleeping",
  "Studying more",
  "Social media",
  "Counseling",
  "Other",
];

interface FormData {
  yearInCollege: string;
  major: string;
  stressFrequency: string;
  stressSources: string[];
  stressSourcesOther: string;
  copingMethods: string[];
  copingOther: string;
  mentalHealthRating: string;
  schoolSupport: string;
}

interface FormErrors {
  yearInCollege?: string;
  major?: string;
  stressFrequency?: string;
  stressSources?: string;
  stressSourcesOther?: string;
  copingMethods?: string;
  copingOther?: string;
  mentalHealthRating?: string;
  schoolSupport?: string;
  form?: string;
}

const initialFormData: FormData = {
  yearInCollege: "",
  major: "",
  stressFrequency: "",
  stressSources: [],
  stressSourcesOther: "",
  copingMethods: [],
  copingOther: "",
  mentalHealthRating: "",
  schoolSupport: "",
};

const linkClass =
  "text-sm font-medium text-[#6b21b8] underline hover:text-[#8A3BDB] focus:outline-none focus:ring-2 focus:ring-[#8A3BDB] focus:ring-offset-2 rounded";

export default function Survey() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const stressOtherRef = useRef<HTMLInputElement>(null);
  const copingOtherRef = useRef<HTMLInputElement>(null);
  const prevStressOther = useRef(false);
  const prevCopingOther = useRef(false);

  const stressOtherChecked = formData.stressSources.includes("Other");
  const copingOtherChecked = formData.copingMethods.includes("Other");

  useEffect(() => {
    if (stressOtherChecked && !prevStressOther.current && stressOtherRef.current) {
      stressOtherRef.current.focus();
    }
    prevStressOther.current = stressOtherChecked;
  }, [stressOtherChecked]);

  useEffect(() => {
    if (copingOtherChecked && !prevCopingOther.current && copingOtherRef.current) {
      copingOtherRef.current.focus();
    }
    prevCopingOther.current = copingOtherChecked;
  }, [copingOtherChecked]);

  function validate(): FormErrors {
    const e: FormErrors = {};
    if (!formData.yearInCollege) e.yearInCollege = "Please select your year in college.";
    if (!formData.major.trim()) e.major = "Please enter your major or field of study.";
    if (!formData.stressFrequency) e.stressFrequency = "Please select how often you feel stressed.";
    if (formData.stressSources.length === 0) e.stressSources = "Please select at least one source of stress.";
    if (stressOtherChecked && !formData.stressSourcesOther.trim())
      e.stressSourcesOther = "Please describe your other source of stress.";
    if (formData.copingMethods.length === 0) e.copingMethods = "Please select at least one coping method.";
    if (copingOtherChecked && !formData.copingOther.trim())
      e.copingOther = "Please describe your other coping method.";
    if (!formData.mentalHealthRating) e.mentalHealthRating = "Please rate your mental health.";
    if (!formData.schoolSupport) e.schoolSupport = "Please select an option.";
    return e;
  }

  function handleCheckboxChange(field: "stressSources" | "copingMethods", value: string) {
    setFormData((prev) => {
      const current = prev[field];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [field]: updated };
    });
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      const firstErrorKey = Object.keys(validationErrors)[0];
      const el = document.getElementById(`error-${firstErrorKey}`);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setSubmitting(true);
    setErrors({});

    const payload: SurveyResponse = {
      year_in_college: formData.yearInCollege,
      major: formData.major.trim(),
      stress_frequency: formData.stressFrequency,
      stress_sources: formData.stressSources,
      stress_sources_other: stressOtherChecked ? formData.stressSourcesOther.trim() : null,
      coping_methods: formData.copingMethods,
      coping_other: copingOtherChecked ? formData.copingOther.trim() : null,
      mental_health_rating: parseInt(formData.mentalHealthRating, 10),
      school_support: formData.schoolSupport,
    };

    const { error } = await supabase.from("mental_health_survey_results").insert([payload]);
    setSubmitting(false);

    if (error) {
      setErrors({ form: "There was a problem submitting your response. Please try again." });
      return;
    }

    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <header className="border-b border-gray-200 px-4 py-4 flex justify-between items-center">
          <span className="text-lg font-semibold text-gray-900">Stress &amp; Mental Health Survey</span>
          <Link href="/results" className={linkClass}>View Results</Link>
        </header>
        <main className="flex-1 px-4 py-12">
          <div className="max-w-2xl mx-auto">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Thank you for your response!</h1>
              <p className="text-gray-600">Your survey has been submitted successfully.</p>
            </div>

            <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Responses</h2>
            <dl className="space-y-3 text-sm border border-gray-200 rounded-lg p-4">
              {[
                { dt: "Year in college", dd: <span className="capitalize">{formData.yearInCollege}</span> },
                { dt: "Major", dd: formData.major },
                { dt: "Stress frequency", dd: <span className="capitalize">{formData.stressFrequency}</span> },
                {
                  dt: "Stress sources",
                  dd: (
                    <>
                      {formData.stressSources.join(", ")}
                      {stressOtherChecked && formData.stressSourcesOther ? ` (${formData.stressSourcesOther})` : ""}
                    </>
                  ),
                },
                {
                  dt: "Coping methods",
                  dd: (
                    <>
                      {formData.copingMethods.join(", ")}
                      {copingOtherChecked && formData.copingOther ? ` (${formData.copingOther})` : ""}
                    </>
                  ),
                },
                { dt: "Mental health rating", dd: `${formData.mentalHealthRating} / 5` },
                { dt: "School support", dd: formData.schoolSupport },
              ].map(({ dt, dd }) => (
                <div key={dt} className="grid grid-cols-[1fr_2fr] gap-2">
                  <dt className="font-medium text-gray-600">{dt}</dt>
                  <dd className="text-gray-900">{dd}</dd>
                </div>
              ))}
            </dl>

            <div className="flex flex-col sm:flex-row gap-4 mt-10">
              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormData(initialFormData);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="px-6 py-3 bg-[#8A3BDB] text-white font-semibold rounded-lg hover:bg-[#7a2ec9] focus:outline-none focus:ring-2 focus:ring-[#8A3BDB] focus:ring-offset-2 transition-colors"
              >
                Submit Another Response
              </button>
              <Link
                href="/results"
                className="inline-block px-6 py-3 border-2 border-[#8A3BDB] text-[#6b21b8] font-semibold rounded-lg hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-[#8A3BDB] focus:ring-offset-2 transition-colors text-center"
              >
                View Results
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="border-b border-gray-200 px-4 py-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-900">Stress &amp; Mental Health Survey</h1>
        <Link href="/results" className={linkClass}>View Results</Link>
      </header>

      <main className="flex-1 px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <p className="text-gray-600 mb-8 text-sm">
            All fields are required. Your responses are anonymous.
          </p>

          {errors.form && (
            <div role="alert" className="mb-6 p-4 bg-red-50 border border-red-300 rounded-lg text-red-700 text-sm">
              {errors.form}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Q1 */}
            <div className="mb-8">
              <label htmlFor="yearInCollege" className="block text-base font-semibold text-gray-900 mb-1">
                1. What is your current year in college?{" "}
                <span aria-hidden="true" className="text-red-600">*</span>
              </label>
              {errors.yearInCollege && (
                <p id="error-yearInCollege" role="alert" aria-live="polite" className="text-red-600 text-sm mb-1">
                  {errors.yearInCollege}
                </p>
              )}
              <select
                id="yearInCollege"
                value={formData.yearInCollege}
                onChange={(e) => {
                  setFormData((p) => ({ ...p, yearInCollege: e.target.value }));
                  setErrors((p) => ({ ...p, yearInCollege: undefined }));
                }}
                aria-describedby={errors.yearInCollege ? "error-yearInCollege" : undefined}
                aria-invalid={!!errors.yearInCollege}
                aria-required="true"
                className="block w-full sm:w-64 border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#8A3BDB] focus:border-[#8A3BDB] bg-white"
              >
                <option value="">Select year...</option>
                <option value="freshman">Freshman</option>
                <option value="sophomore">Sophomore</option>
                <option value="junior">Junior</option>
                <option value="senior">Senior</option>
              </select>
            </div>

            {/* Q2 */}
            <div className="mb-8">
              <label htmlFor="major" className="block text-base font-semibold text-gray-900 mb-1">
                2. What is your major or field of study?{" "}
                <span aria-hidden="true" className="text-red-600">*</span>
              </label>
              {errors.major && (
                <p id="error-major" role="alert" aria-live="polite" className="text-red-600 text-sm mb-1">
                  {errors.major}
                </p>
              )}
              <input
                type="text"
                id="major"
                value={formData.major}
                onChange={(e) => {
                  setFormData((p) => ({ ...p, major: e.target.value }));
                  setErrors((p) => ({ ...p, major: undefined }));
                }}
                aria-describedby={errors.major ? "error-major" : undefined}
                aria-invalid={!!errors.major}
                aria-required="true"
                placeholder="e.g. Computer Science"
                className="block w-full sm:w-80 border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8A3BDB] focus:border-[#8A3BDB]"
              />
            </div>

            {/* Q3 */}
            <fieldset className="mb-8">
              <legend className="text-base font-semibold text-gray-900 mb-1">
                3. How often do you feel stressed during a typical week?{" "}
                <span aria-hidden="true" className="text-red-600">*</span>
              </legend>
              {errors.stressFrequency && (
                <p id="error-stressFrequency" role="alert" aria-live="polite" className="text-red-600 text-sm mb-2">
                  {errors.stressFrequency}
                </p>
              )}
              <div className="space-y-2 mt-2">
                {["never", "rarely", "sometimes", "often", "always"].map((option) => (
                  <label key={option} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="stressFrequency"
                      value={option}
                      checked={formData.stressFrequency === option}
                      onChange={() => {
                        setFormData((p) => ({ ...p, stressFrequency: option }));
                        setErrors((p) => ({ ...p, stressFrequency: undefined }));
                      }}
                      aria-describedby={errors.stressFrequency ? "error-stressFrequency" : undefined}
                      className="w-4 h-4 accent-[#8A3BDB]"
                    />
                    <span className="text-gray-800 capitalize">{option}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            {/* Q4 */}
            <fieldset className="mb-8">
              <legend className="text-base font-semibold text-gray-900 mb-1">
                4. What are your biggest sources of stress?{" "}
                <span aria-hidden="true" className="text-red-600">*</span>
                <span className="block text-sm font-normal text-gray-500">Select all that apply</span>
              </legend>
              {errors.stressSources && (
                <p id="error-stressSources" role="alert" aria-live="polite" className="text-red-600 text-sm mb-2">
                  {errors.stressSources}
                </p>
              )}
              <div className="space-y-2 mt-2">
                {STRESS_SOURCES.map((source) => (
                  <div key={source}>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        value={source}
                        checked={formData.stressSources.includes(source)}
                        onChange={() => handleCheckboxChange("stressSources", source)}
                        aria-describedby={errors.stressSources ? "error-stressSources" : undefined}
                        className="w-4 h-4 accent-[#8A3BDB] rounded"
                      />
                      <span className="text-gray-800">{source}</span>
                    </label>
                    {source === "Other" && stressOtherChecked && (
                      <div className="ml-7 mt-2">
                        {errors.stressSourcesOther && (
                          <p id="error-stressSourcesOther" role="alert" aria-live="polite" className="text-red-600 text-sm mb-1">
                            {errors.stressSourcesOther}
                          </p>
                        )}
                        <label htmlFor="stressSourcesOther" className="block text-sm font-medium text-gray-700 mb-1">
                          Please describe your other source of stress:
                        </label>
                        <input
                          ref={stressOtherRef}
                          type="text"
                          id="stressSourcesOther"
                          value={formData.stressSourcesOther}
                          onChange={(e) => {
                            setFormData((p) => ({ ...p, stressSourcesOther: e.target.value }));
                            setErrors((p) => ({ ...p, stressSourcesOther: undefined }));
                          }}
                          aria-describedby={errors.stressSourcesOther ? "error-stressSourcesOther" : undefined}
                          aria-invalid={!!errors.stressSourcesOther}
                          aria-required="true"
                          placeholder="Describe your other source of stress"
                          className="block w-full sm:w-80 border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8A3BDB] focus:border-[#8A3BDB] text-sm"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </fieldset>

            {/* Q5 */}
            <fieldset className="mb-8">
              <legend className="text-base font-semibold text-gray-900 mb-1">
                5. How do you usually cope with stress?{" "}
                <span aria-hidden="true" className="text-red-600">*</span>
                <span className="block text-sm font-normal text-gray-500">Select all that apply</span>
              </legend>
              {errors.copingMethods && (
                <p id="error-copingMethods" role="alert" aria-live="polite" className="text-red-600 text-sm mb-2">
                  {errors.copingMethods}
                </p>
              )}
              <div className="space-y-2 mt-2">
                {COPING_METHODS.map((method) => (
                  <div key={method}>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        value={method}
                        checked={formData.copingMethods.includes(method)}
                        onChange={() => handleCheckboxChange("copingMethods", method)}
                        aria-describedby={errors.copingMethods ? "error-copingMethods" : undefined}
                        className="w-4 h-4 accent-[#8A3BDB] rounded"
                      />
                      <span className="text-gray-800">{method}</span>
                    </label>
                    {method === "Other" && copingOtherChecked && (
                      <div className="ml-7 mt-2">
                        {errors.copingOther && (
                          <p id="error-copingOther" role="alert" aria-live="polite" className="text-red-600 text-sm mb-1">
                            {errors.copingOther}
                          </p>
                        )}
                        <label htmlFor="copingOther" className="block text-sm font-medium text-gray-700 mb-1">
                          Please describe your other coping method:
                        </label>
                        <input
                          ref={copingOtherRef}
                          type="text"
                          id="copingOther"
                          value={formData.copingOther}
                          onChange={(e) => {
                            setFormData((p) => ({ ...p, copingOther: e.target.value }));
                            setErrors((p) => ({ ...p, copingOther: undefined }));
                          }}
                          aria-describedby={errors.copingOther ? "error-copingOther" : undefined}
                          aria-invalid={!!errors.copingOther}
                          aria-required="true"
                          placeholder="Describe your other coping method"
                          className="block w-full sm:w-80 border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8A3BDB] focus:border-[#8A3BDB] text-sm"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </fieldset>

            {/* Q6 */}
            <fieldset className="mb-8">
              <legend className="text-base font-semibold text-gray-900 mb-1">
                6. How would you rate your overall mental health?{" "}
                <span aria-hidden="true" className="text-red-600">*</span>
              </legend>
              {errors.mentalHealthRating && (
                <p id="error-mentalHealthRating" role="alert" aria-live="polite" className="text-red-600 text-sm mb-2">
                  {errors.mentalHealthRating}
                </p>
              )}
              <div className="space-y-2 mt-2">
                {[
                  { value: "1", label: "1 — Very poor" },
                  { value: "2", label: "2 — Poor" },
                  { value: "3", label: "3 — Average" },
                  { value: "4", label: "4 — Good" },
                  { value: "5", label: "5 — Excellent" },
                ].map(({ value, label }) => (
                  <label key={value} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="mentalHealthRating"
                      value={value}
                      checked={formData.mentalHealthRating === value}
                      onChange={() => {
                        setFormData((p) => ({ ...p, mentalHealthRating: value }));
                        setErrors((p) => ({ ...p, mentalHealthRating: undefined }));
                      }}
                      aria-describedby={errors.mentalHealthRating ? "error-mentalHealthRating" : undefined}
                      className="w-4 h-4 accent-[#8A3BDB]"
                    />
                    <span className="text-gray-800">{label}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            {/* Q7 */}
            <fieldset className="mb-10">
              <legend className="text-base font-semibold text-gray-900 mb-1">
                7. Do you feel your college provides enough mental health resources?{" "}
                <span aria-hidden="true" className="text-red-600">*</span>
              </legend>
              {errors.schoolSupport && (
                <p id="error-schoolSupport" role="alert" aria-live="polite" className="text-red-600 text-sm mb-2">
                  {errors.schoolSupport}
                </p>
              )}
              <div className="space-y-2 mt-2">
                {["Yes", "No", "Not sure"].map((option) => (
                  <label key={option} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="schoolSupport"
                      value={option}
                      checked={formData.schoolSupport === option}
                      onChange={() => {
                        setFormData((p) => ({ ...p, schoolSupport: option }));
                        setErrors((p) => ({ ...p, schoolSupport: undefined }));
                      }}
                      aria-describedby={errors.schoolSupport ? "error-schoolSupport" : undefined}
                      className="w-4 h-4 accent-[#8A3BDB]"
                    />
                    <span className="text-gray-800">{option}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto px-8 py-3 bg-[#8A3BDB] text-white font-semibold rounded-lg hover:bg-[#7a2ec9] focus:outline-none focus:ring-2 focus:ring-[#8A3BDB] focus:ring-offset-2 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? "Submitting..." : "Submit Survey"}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
