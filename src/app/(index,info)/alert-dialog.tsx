import React from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogDestructive,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogInput,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { View, Text, ScrollView } from "@/tw";

export default function AlertDialogExample() {
  return (
    <ScrollView>
      <View className="mx-auto flex w-full max-w-2xl min-w-0 flex-1 flex-col gap-8 px-4 py-6 md:px-0 lg:py-8">
        <View className="gap-2">
          <Text className="hidden web:visible text-2xl text-sf-text font-bold">
            Alert Dialog
          </Text>

          <Text className="text-sf-text-2">
            A modal dialog that interrupts the user with important content and
            expects a response.
          </Text>
        </View>

        {/* Basic Example */}
        <View className="gap-4">
          <Text className="text-lg text-sf-text font-semibold">
            Basic Example
          </Text>
          <View className="flex w-full justify-center items-center p-10 border border-sf-border rounded-lg bg-sf-grouped-bg">
            <AlertDialog>
              <AlertDialogTrigger className="px-4 py-2 rounded-lg border border-sf-border bg-sf-bg text-sf-text font-medium hover:bg-sf-fill cursor-pointer">
                Show Dialog
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </View>
        </View>

        {/* Destructive Example */}
        <View className="gap-4">
          <Text className="text-lg text-sf-text font-semibold">
            Destructive Action
          </Text>
          <View className="flex w-full justify-center items-center p-10 border border-sf-border rounded-lg bg-sf-grouped-bg">
            <AlertDialog>
              <AlertDialogTrigger className="px-4 py-2 rounded-lg bg-sf-red text-white font-medium hover:bg-sf-red/90 cursor-pointer">
                Delete Account
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Account</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete your account? This action is
                    permanent and cannot be reversed.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogDestructive
                    onPress={() => console.log("Account deleted!")}
                  >
                    Delete
                  </AlertDialogDestructive>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </View>
        </View>

        {/* With Callbacks Example */}
        <View className="gap-4">
          <Text className="text-lg text-sf-text font-semibold">
            With Callbacks
          </Text>
          <View className="flex w-full justify-center items-center p-10 border border-sf-border rounded-lg bg-sf-grouped-bg">
            <AlertDialog>
              <AlertDialogTrigger className="px-4 py-2 rounded-lg bg-sf-blue text-white font-medium hover:bg-sf-blue/90 cursor-pointer">
                Save Changes
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Save Changes?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Do you want to save your changes before leaving?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onPress={() => console.log("Cancelled")}>
                    Don't Save
                  </AlertDialogCancel>
                  <AlertDialogAction onPress={() => console.log("Saved!")}>
                    Save
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </View>
        </View>

        {/* Prompt Example */}
        <View className="gap-4">
          <Text className="text-lg text-sf-text font-semibold">
            Prompt with Input
          </Text>
          <Text className="text-sf-text-2 text-sm">
            Uses Alert.prompt on iOS for native text input.
          </Text>
          <View className="flex w-full justify-center items-center p-10 border border-sf-border rounded-lg bg-sf-grouped-bg">
            <AlertDialog>
              <AlertDialogTrigger className="px-4 py-2 rounded-lg bg-sf-blue text-white font-medium hover:bg-sf-blue/90 cursor-pointer">
                Rename Item
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Rename</AlertDialogTitle>
                  <AlertDialogDescription>
                    Enter a new name for this item.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogInput
                  placeholder="Enter name..."
                  defaultValue="My Item"
                />
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onPress={(value) => console.log("New name:", value)}
                  >
                    Rename
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </View>
        </View>

        {/* Secure Input Example */}
        <View className="gap-4">
          <Text className="text-lg text-sf-text font-semibold">
            Secure Input (Password)
          </Text>
          <View className="flex w-full justify-center items-center p-10 border border-sf-border rounded-lg bg-sf-grouped-bg">
            <AlertDialog>
              <AlertDialogTrigger className="px-4 py-2 rounded-lg border border-sf-border bg-sf-bg text-sf-text font-medium hover:bg-sf-fill cursor-pointer">
                Enter Password
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Authentication Required</AlertDialogTitle>
                  <AlertDialogDescription>
                    Please enter your password to continue.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogInput
                  type="secure-text"
                  placeholder="Password"
                />
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onPress={(password) => console.log("Password entered:", password ? "***" : "(empty)")}
                  >
                    Authenticate
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
