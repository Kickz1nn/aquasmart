CREATE UNIQUE INDEX "Session_one_active_only"
ON "Session" ("status")
WHERE "status" = 'IN_PROGRESS';