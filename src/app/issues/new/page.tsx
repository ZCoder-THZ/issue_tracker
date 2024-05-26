'use client'
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
// import SimpleMDE from "react-simplemde-editor";
const SimpleMDE = dynamic(() => import("react-simplemde-editor"), { ssr: false });
import "easymde/dist/easymde.min.css";
import {  useState } from "react";
import axios from 'axios';
import { useForm, Controller } from "react-hook-form"
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import {zodResolver} from '@hookform/resolvers/zod'
import ErrorMessage from "@/components/ErrorMessage";
import Spinner from "@/components/Spinner";
import issueActions from "../issueActions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
 
import ReactMarkdown from 'react-markdown';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createIssueSchema } from "@/app/validationSchemas";
import {z} from 'zod'


type IssueForm=z.infer<typeof createIssueSchema>;

export default function Dashboard() {
  const [loading,setLoading]=useState(false)
  const {register,handleSubmit,control, formState: { errors },}=useForm<IssueForm>({
    resolver:zodResolver(createIssueSchema)
  })
  
  
  const queryClient = useQueryClient();
  const { data: issues, isLoading: isIssuesLoading, error } = useQuery({
    queryKey: ['issues'],
    queryFn: () => axios.get('/api/issues').then((res) => res.data.issues),
  });

  const mutation = useMutation({
    mutationFn: (newIssue) => axios.post('/api/issues', newIssue),
    onSuccess: () => {
      queryClient.invalidateQueries(['issues']);
      setLoading(false)
    },
    onError:(error)=>{
      console.log(error.response.message)
    }
  });

  const deleteMutation=useMutation({
    mutationFn: (id) => axios.delete(`/api/issues/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['issues']);
    },
  })
  const createIssue = async (title,description) => {
      setLoading(true)
      mutation.mutate({ title, description });
   
  };

  if (isIssuesLoading) return <p>Loading issues...</p>;
  if (error) return <p>An error occurred: {error.message}</p>;

  return (
    <div className="flex flex-col min-h-screen w-full bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <main className="">
          <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
            <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-4 lg:gap-2">
              <div className="lg:col-span-4">
                <form onSubmit={handleSubmit(data=>createIssue(data.title,data.description))} className="space-y-6">
                  <Card x-chunk="dashboard-07-chunk-0">
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
                          render={({field})=>
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
                          <Button className="" type="submit">Add Issue 
                           {
                            loading&&<Spinner/>
                           }
                          </Button>
                          </div>
                      </div>
                    </CardContent>
                  </Card>
                </form>
              </div>
              <div className="lg:col-span-4 space-y-4">
                {issues?.slice().reverse().map((issue) => (
                  <Card key={issue.id} className="overflow-hidden w-98" x-chunk="dashboard-07-chunk-3">
                    <CardHeader>
                      <CardTitle>{issue.title}</CardTitle>
                      <CardDescription>
                        <ReactMarkdown>
                        {issue.description}
                        </ReactMarkdown>
                       </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button size="sm"  variant="destructive" onClick={() => deleteMutation.mutate(issue.id)}>
                      Delete Issue
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
