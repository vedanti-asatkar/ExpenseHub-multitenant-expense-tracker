CREATE TABLE "expense" (
	"id" serial PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"owner_id" text NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"category" text NOT NULL,
	"description" text,
	"date" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "expense_organization_id_idx" ON "expense" USING btree ("organization_id");