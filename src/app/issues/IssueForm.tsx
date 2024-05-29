// IssueForm.tsx
'use client'
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import "easymde/dist/easymde.min.css";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import ErrorMessage from "@/components/ErrorMessage";
import Spinner from "@/components/Spinner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createIssueSchema } from "@/app/validationSchemas";
import { z } from 'zod';
import axios from 'axios';

const SimpleMDE = dynamic(() => import("react-simplemde-editor"), { ssr: false });

type IssueForm = z.infer<typeof createIssueSchema>;

const IssueFormComponent = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, control, formState: { errors } } = useForm<IssueForm>({
    resolver: zodResolver(createIssueSchema)
  });

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (newIssue) => axios.post('/api/issues', newIssue),
    onSuccess: () => {
      router.refresh();
      queryClient.invalidateQueries(['issues']);
      setLoading(false);
    },
    onError: (error) => {
      console.log(error.response.message);
      setLoading(false);
    }
  });

  const createIssue = (title, description) => {
    setLoading(true);
    mutation.mutate({ title, description });
  };

  return (
    <form onSubmit={handleSubmit(data => createIssue(data.title, data.description))} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add Issue</CardTitle>
          <CardDescription>Please add an issue</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                {...register('title')}
                type="text"
                className="w-full mb-3"
              />
              {errors.title && 
                <ErrorMessage>
                  {errors.title.message}
                </ErrorMessage>
              }
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Controller
                name="description"
                control={control}
                render={({ field }) =>
                  <SimpleMDE
                    id="description"
                    {...field}
                  />}
              />
              {errors.description && 
                <ErrorMessage>
                  {errors.description.message}
                </ErrorMessage>
              }
            </div>
            <div className="flex justify-end">
              <Button type="submit">Add Issue 
                {loading && <Spinner />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  );
};

export default IssueFormComponent;
