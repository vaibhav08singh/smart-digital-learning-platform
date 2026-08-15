"use client";

import { useEffect, useState } from "react";
import {
  Download,
  GraduationCap,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  UserCheck,
  Users,
  Eye,
  Shield,
  UserPlus,
  Lock,
  Key,
  Sparkles,
  Check,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  deleteUserAccount,
  getAllUserAccounts,
  createAdminAccount,
  updateUserRole,
  type AuthUser,
} from "@/services/auth.service";
import { useStudentProfile } from "@/services/auth.service";

interface ExtendedUser extends AuthUser {
  password?: string;
}

export default function AdminDashboardPage() {
  const profile = useStudentProfile();
  const [users, setUsers] = useState<ExtendedUser[]>([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "admin" | "student">("all");
  const [selectedUser, setSelectedUser] = useState<ExtendedUser | null>(null);
  const [deleteConfirmUser, setDeleteConfirmUser] = useState<ExtendedUser | null>(null);

  // Add Admin Account Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newAdminName, setNewAdminName] = useState("");
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("admin123");
  const [newAdminRole, setNewAdminRole] = useState<"admin" | "student">("admin");
  const [newAdminLevel, setNewAdminLevel] = useState("btech");
  const [newAdminInstitution, setNewAdminInstitution] = useState(
    "State Institute of Engineering and Technology Nilokheri"
  );
  const [addError, setAddError] = useState("");
  const [addSuccess, setAddSuccess] = useState("");

  useEffect(() => {
    loadUsers();
  }, [profile.email]);

  function loadUsers() {
    const list = getAllUserAccounts();
    setUsers(list);
  }

  function handleDelete(user: ExtendedUser) {
    if (user.email.toLowerCase() === "vaibhav4866singh@gmail.com") {
      alert("Super Admin account (vaibhav4866singh@gmail.com) cannot be deleted.");
      return;
    }
    deleteUserAccount(user.id);
    loadUsers();
    setDeleteConfirmUser(null);
    if (selectedUser?.id === user.id) {
      setSelectedUser(null);
    }
  }

  function handleToggleRole(user: ExtendedUser) {
    if (user.email.toLowerCase() === "vaibhav4866singh@gmail.com") {
      alert("Super Admin role (vaibhav4866singh@gmail.com) cannot be modified.");
      return;
    }
    const targetRole = user.role === "admin" ? "student" : "admin";
    try {
      updateUserRole(user.id, targetRole);
      loadUsers();
      if (selectedUser?.id === user.id) {
        setSelectedUser({ ...selectedUser, role: targetRole });
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update role");
    }
  }

  function handleCreateAccount(e: React.FormEvent) {
    e.preventDefault();
    setAddError("");
    setAddSuccess("");

    if (!newAdminName.trim() || !newAdminEmail.trim()) {
      setAddError("Please enter both Name and Email address.");
      return;
    }

    try {
      const created = createAdminAccount({
        name: newAdminName.trim(),
        email: newAdminEmail.trim(),
        password: newAdminPassword.trim() || "admin123",
        role: newAdminRole,
        levelId: newAdminLevel,
        institution: newAdminInstitution.trim(),
      });

      loadUsers();
      setAddSuccess(
        `Account successfully created for ${created.name} (${created.role === "admin" ? "Admin 👑" : "Student 🎓"})!`
      );

      setTimeout(() => {
        setNewAdminName("");
        setNewAdminEmail("");
        setNewAdminPassword("admin123");
        setAddSuccess("");
        setIsAddModalOpen(false);
      }, 1200);
    } catch (err) {
      setAddError(err instanceof Error ? err.message : "Failed to create account.");
    }
  }

  function exportUserData() {
    const dataStr = JSON.stringify(users, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `codezen-users-export-${new Date().toISOString().split("T")[0]}.json`;
    link.click();
  }

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.institution && u.institution.toLowerCase().includes(search.toLowerCase()));

    const isUserAdmin = u.role === "admin" || u.email.toLowerCase() === "vaibhav4866singh@gmail.com";
    const matchesRole =
      roleFilter === "all" ||
      (roleFilter === "admin" && isUserAdmin) ||
      (roleFilter === "student" && !isUserAdmin);

    return matchesSearch && matchesRole;
  });

  const totalUsers = users.length;
  const totalAdmins = users.filter(
    (u) => u.role === "admin" || u.email.toLowerCase() === "vaibhav4866singh@gmail.com"
  ).length;
  const totalStudents = totalUsers - totalAdmins;
  const btechStudents = users.filter(
    (u) => u.levelId === "btech" || (u.institution && u.institution.toLowerCase().includes("engineering"))
  ).length;

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-4 sm:p-6 lg:p-8">
      {/* Top Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-3xl border border-primary/30 bg-gradient-to-r from-indigo-950/80 via-slate-900 to-violet-950/80 p-6 shadow-xl backdrop-blur-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold shadow-md">
              👑
            </span>
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
              Admin Control Panel
            </h1>
            <Badge variant="default" className="bg-amber-500/20 text-amber-300 border-amber-500/40">
              Superadmin Mode
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Logged in as <span className="font-semibold text-primary">vaibhav4866singh@gmail.com</span> · Platform Metrics & User Account Management
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="default"
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            className="gap-1.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold shadow-lg shadow-amber-500/20 border-0"
          >
            <UserPlus className="h-4 w-4" /> Add Admin ID / Account
          </Button>

          <Button variant="outline" size="sm" onClick={loadUsers} className="gap-1.5">
            <RefreshCw className="h-4 w-4" /> Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={exportUserData} className="gap-1.5">
            <Download className="h-4 w-4" /> Export Users JSON
          </Button>
        </div>
      </div>

      {/* Analytics KPI Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/60 bg-card/60 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Total Accounts
            </CardTitle>
            <Users className="h-4 w-4 text-indigo-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">{totalUsers}</div>
            <p className="text-xs text-muted-foreground mt-1">Registered learning profiles</p>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Active Students
            </CardTitle>
            <UserCheck className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-emerald-400">{totalStudents}</div>
            <p className="text-xs text-muted-foreground mt-1">Enrolled active learners</p>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Engineering / BTech
            </CardTitle>
            <GraduationCap className="h-4 w-4 text-violet-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-violet-400">{btechStudents}</div>
            <p className="text-xs text-muted-foreground mt-1">SIET Nilokheri & engineering labs</p>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Admins
            </CardTitle>
            <ShieldCheck className="h-4 w-4 text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-amber-400">{totalAdmins}</div>
            <p className="text-xs text-muted-foreground mt-1">Superuser privileges</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Accounts Table Card */}
      <Card className="border-border/80 bg-card/80 backdrop-blur-xl shadow-lg">
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="text-lg font-bold">User Accounts Directory</CardTitle>
              <CardDescription>
                Real-time list of all registered accounts, roles, institutions, and login activity.
              </CardDescription>
            </div>

            <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
              <div className="relative min-w-[240px]">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, college..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 text-xs"
                />
              </div>

              <div className="flex items-center gap-1 rounded-lg border bg-muted/40 p-1 text-xs">
                <button
                  type="button"
                  onClick={() => setRoleFilter("all")}
                  className={`rounded-md px-2.5 py-1 font-medium transition-all ${
                    roleFilter === "all" ? "bg-background shadow text-foreground" : "text-muted-foreground"
                  }`}
                >
                  All ({users.length})
                </button>
                <button
                  type="button"
                  onClick={() => setRoleFilter("admin")}
                  className={`rounded-md px-2.5 py-1 font-medium transition-all ${
                    roleFilter === "admin" ? "bg-amber-500/20 text-amber-300 shadow" : "text-muted-foreground"
                  }`}
                >
                  Admins ({totalAdmins})
                </button>
                <button
                  type="button"
                  onClick={() => setRoleFilter("student")}
                  className={`rounded-md px-2.5 py-1 font-medium transition-all ${
                    roleFilter === "student" ? "bg-primary/20 text-primary shadow" : "text-muted-foreground"
                  }`}
                >
                  Students ({totalStudents})
                </button>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b bg-muted/30 text-muted-foreground">
                <tr>
                  <th className="p-3 font-semibold">User Account</th>
                  <th className="p-3 font-semibold">Role</th>
                  <th className="p-3 font-semibold">Level / Institution</th>
                  <th className="p-3 font-semibold">Registered</th>
                  <th className="p-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-muted-foreground">
                      No accounts matched your search parameters.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => {
                    const isAdmin = u.role === "admin" || u.email.toLowerCase() === "vaibhav4866singh@gmail.com";
                    const isSuperadmin = u.email.toLowerCase() === "vaibhav4866singh@gmail.com";

                    return (
                      <tr key={u.id} className="hover:bg-muted/20 transition-colors">
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-bold text-white text-xs ${
                                isAdmin
                                  ? "bg-gradient-to-br from-amber-500 to-orange-600 shadow-md shadow-amber-500/20"
                                  : "bg-gradient-to-br from-indigo-500 to-violet-600"
                              }`}
                            >
                              {u.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-semibold text-foreground flex items-center gap-1.5">
                                {u.name}
                                {isAdmin && <span className="text-[10px] text-amber-400">👑</span>}
                              </p>
                              <p className="text-muted-foreground">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          {isAdmin ? (
                            <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/40">
                              <Shield className="mr-1 h-3 w-3" /> Admin
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-muted-foreground">
                              Student
                            </Badge>
                          )}
                        </td>
                        <td className="p-3">
                          <p className="font-medium text-foreground">
                            {u.levelId ? u.levelId.toUpperCase() : "BTECH CSE"}
                          </p>
                          <p className="text-muted-foreground text-[11px] truncate max-w-[200px]">
                            {u.institution || "State Institute of Engineering and Technology Nilokheri"}
                          </p>
                        </td>
                        <td className="p-3 text-muted-foreground whitespace-nowrap">
                          {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "2026-08-14"}
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Make Admin / Revoke Admin quick button */}
                            {!isSuperadmin && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleToggleRole(u)}
                                className={`h-8 px-2.5 text-xs transition-all ${
                                  !isAdmin
                                    ? "border-amber-500/40 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 hover:text-amber-200"
                                    : "border-indigo-500/40 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 hover:text-indigo-200"
                                }`}
                                title={!isAdmin ? "Promote user to Admin" : "Demote Admin to Student"}
                              >
                                <Shield className="h-3.5 w-3.5 mr-1" />
                                {!isAdmin ? "Make Admin" : "Make Student"}
                              </Button>
                            )}

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedUser(u)}
                              className="h-8 px-2 text-xs"
                            >
                              <Eye className="h-3.5 w-3.5 mr-1" /> View
                            </Button>

                            {!isSuperadmin && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setDeleteConfirmUser(u)}
                                className="h-8 px-2 text-xs text-destructive hover:bg-destructive/10"
                                title="Delete User Account"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Modal: Create New Admin / User Account */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-lg border-primary/30 bg-slate-950 p-6 text-foreground shadow-2xl backdrop-blur-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-bold text-amber-400">
              <UserPlus className="h-5 w-5 text-amber-400" /> Create New Admin or User ID
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Register a new Administrator or Student account with custom credentials.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateAccount} className="space-y-4 pt-3 text-xs">
            {addError && (
              <div className="flex items-center gap-2 rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{addError}</span>
              </div>
            )}

            {addSuccess && (
              <div className="flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3 text-emerald-400">
                <Check className="h-4 w-4 shrink-0" />
                <span>{addSuccess}</span>
              </div>
            )}

            {/* Role Selection */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-200">Account Type & Role</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setNewAdminRole("admin")}
                  className={`flex items-center justify-center gap-2 rounded-xl border p-3 font-semibold transition-all ${
                    newAdminRole === "admin"
                      ? "border-amber-500/60 bg-amber-500/20 text-amber-300 shadow-md shadow-amber-500/10"
                      : "border-slate-800 bg-slate-900/60 text-slate-400 hover:bg-slate-900"
                  }`}
                >
                  <Shield className="h-4 w-4 text-amber-400" /> Admin (Superuser 👑)
                </button>
                <button
                  type="button"
                  onClick={() => setNewAdminRole("student")}
                  className={`flex items-center justify-center gap-2 rounded-xl border p-3 font-semibold transition-all ${
                    newAdminRole === "student"
                      ? "border-indigo-500/60 bg-indigo-500/20 text-indigo-300 shadow-md shadow-indigo-500/10"
                      : "border-slate-800 bg-slate-900/60 text-slate-400 hover:bg-slate-900"
                  }`}
                >
                  <GraduationCap className="h-4 w-4 text-indigo-400" /> Student Learner 🎓
                </button>
              </div>
            </div>

            {/* Name */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-200">Full Name</label>
              <Input
                placeholder="e.g. Dr. Rajesh Sharma"
                value={newAdminName}
                onChange={(e) => setNewAdminName(e.target.value)}
                className="bg-slate-900 border-slate-800 text-slate-100"
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-200">Email Address (Login ID)</label>
              <Input
                type="email"
                placeholder="e.g. rajesh.admin@codezen.ai"
                value={newAdminEmail}
                onChange={(e) => setNewAdminEmail(e.target.value)}
                className="bg-slate-900 border-slate-800 text-slate-100"
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-200">Password</label>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Password"
                  value={newAdminPassword}
                  onChange={(e) => setNewAdminPassword(e.target.value)}
                  className="bg-slate-900 border-slate-800 text-slate-100 pr-10"
                />
                <Key className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              </div>
              <p className="text-[11px] text-slate-400">Default password is set to admin123</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Level */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-200">Education Level</label>
                <select
                  value={newAdminLevel}
                  onChange={(e) => setNewAdminLevel(e.target.value)}
                  className="w-full rounded-md border border-slate-800 bg-slate-900 p-2 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  <option value="btech">BTech CSE / IT</option>
                  <option value="mtech">MTech Computer Science</option>
                  <option value="bca">BCA / MCA</option>
                  <option value="class-12">Class 12 Senior</option>
                  <option value="class-10">Class 10 High School</option>
                </select>
              </div>

              {/* Institution */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-200">Institution / College</label>
                <Input
                  placeholder="Institution name"
                  value={newAdminInstitution}
                  onChange={(e) => setNewAdminInstitution(e.target.value)}
                  className="bg-slate-900 border-slate-800 text-slate-100"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-200"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold"
              >
                Create {newAdminRole === "admin" ? "Admin ID 👑" : "Account 🎓"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* User Details Modal */}
      <Dialog open={Boolean(selectedUser)} onOpenChange={(open) => !open && setSelectedUser(null)}>
        <DialogContent className="max-w-md border-border/80 bg-card p-6 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <UserCheck className="h-5 w-5 text-primary" /> Account Details & Privileges
            </DialogTitle>
            <DialogDescription>Full profile breakdown & administrative actions</DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-4 pt-2 text-xs">
              <div className="flex items-center justify-between gap-3 rounded-xl border bg-muted/30 p-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-sm">
                    {selectedUser.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-foreground">{selectedUser.name}</h3>
                    <p className="text-muted-foreground">{selectedUser.email}</p>
                  </div>
                </div>

                {selectedUser.email.toLowerCase() !== "vaibhav4866singh@gmail.com" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleToggleRole(selectedUser)}
                    className="h-8 text-xs border-amber-500/40 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20"
                  >
                    <Shield className="h-3.5 w-3.5 mr-1" />
                    {selectedUser.role === "admin" ? "Demote to Student" : "Promote to Admin"}
                  </Button>
                )}
              </div>

              <div className="space-y-2 rounded-xl border p-3">
                <div className="flex justify-between py-1 border-b">
                  <span className="text-muted-foreground">Account Role:</span>
                  <span className="font-semibold capitalize flex items-center gap-1">
                    {selectedUser.role || "student"}
                    {(selectedUser.role === "admin" ||
                      selectedUser.email.toLowerCase() === "vaibhav4866singh@gmail.com") && (
                      <span className="text-amber-400">👑</span>
                    )}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b">
                  <span className="text-muted-foreground">Education Level:</span>
                  <span className="font-semibold">{selectedUser.levelId || "btech"}</span>
                </div>
                <div className="flex justify-between py-1 border-b">
                  <span className="text-muted-foreground">Institution:</span>
                  <span className="font-semibold text-right max-w-[200px] truncate">
                    {selectedUser.institution || "SIET Nilokheri"}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b">
                  <span className="text-muted-foreground">Created Date:</span>
                  <span className="font-semibold">
                    {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleString() : "2026-08-14"}
                  </span>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button size="sm" variant="outline" onClick={() => setSelectedUser(null)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Confirm Delete Modal */}
      <Dialog open={Boolean(deleteConfirmUser)} onOpenChange={(open) => !open && setDeleteConfirmUser(null)}>
        <DialogContent className="max-w-sm border-destructive/40 bg-card p-6">
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2">
              <Trash2 className="h-5 w-5" /> Delete User Account?
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to remove <span className="font-bold text-foreground">{deleteConfirmUser?.email}</span>?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 pt-4">
            <Button size="sm" variant="outline" onClick={() => setDeleteConfirmUser(null)}>
              Cancel
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => deleteConfirmUser && handleDelete(deleteConfirmUser)}
            >
              Confirm Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

