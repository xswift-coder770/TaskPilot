import React, { useState, useEffect } from "react";
import { Modal } from "../common/Modal";
import { Input } from "../common/Input";
import { Button } from "../common/Button";
import { getErrorMessage } from "../../utils/helpers";
import { projectApi } from "../../api/projectApi";

export const ProjectModal = ({ isOpen, onClose, projectToEdit, onSaved }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (projectToEdit) {
      setFormData({
        name: projectToEdit.name || "",
        description: projectToEdit.description || "",
      });
    } else {
      setFormData({ name: "", description: "" });
    }
    setErrors({});
    setServerError("");
  }, [projectToEdit, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    if (serverError) setServerError("");
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Project name is required.";
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "Project name must be at least 3 characters.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setServerError("");

    try {
      if (projectToEdit) {
        const response = await projectApi.updateProject(
          projectToEdit._id,
          formData,
        );
        onSaved(response.data.data);
      } else {
        const response = await projectApi.createProject(formData);
        onSaved(response.data.data);
      }
      onClose();
    } catch (err) {
      setServerError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={projectToEdit ? "Edit Project" : "Create New Project"}
      description={
        projectToEdit
          ? "Update details and settings for your project workspace."
          : "Initialize a new project space to organize tasks and collaborate."
      }
    >
      {serverError && (
        <div className="mb-4 rounded-lg bg-rose-50 p-2.5 text-xs font-medium text-rose-700 dark:bg-rose-950/50 dark:text-rose-300">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Project Name"
          name="name"
          placeholder="e.g. Website Redesign"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
        />

        <div className="space-y-1.5 text-left">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Description (Optional)
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            placeholder="Briefly describe the purpose of this project..."
            value={formData.description}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
        </div>

        <div className="mt-6 flex items-center justify-end gap-2.5">
          <Button variant="ghost" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            {projectToEdit ? "Save Changes" : "Create Project"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ProjectModal;
