import React from "react";

import * as Form from "@/components/ui/form";
import {
  Segments,
  SegmentsContent,
  SegmentsList,
  SegmentsTrigger,
} from "@/components/ui/segments";
import { View, Text, ScrollView } from "@/tw";

export default function SegmentsTest() {
  return (
    <ScrollView>
      <View className="mx-auto flex w-full max-w-2xl min-w-0 flex-1 flex-col gap-8 px-4 py-6 md:px-0 lg:py-8">
        <View className="gap-2">
          <Text className="hidden web:visible text-2xl text-sf-text font-bold">
            Segments
          </Text>

          <Text className="text-sf-text-2">
            A segment component for switching between different views.
          </Text>
        </View>

        <View className="flex w-full justify-center data-[align=center]:items-center data-[align=end]:items-end data-[align=start]:items-start h-[450px] p-10 border border-sf-border rounded-lg bg-sf-grouped-bg">
          <Segments defaultValue="account">
            <SegmentsList>
              <SegmentsTrigger value="account">Account</SegmentsTrigger>
              <SegmentsTrigger value="password">Password</SegmentsTrigger>
            </SegmentsList>

            <SegmentsContent value="account">
              <Form.Text className="py-3">Account Section</Form.Text>
            </SegmentsContent>
            <SegmentsContent value="password">
              <Form.Text className="py-3">Password Section</Form.Text>
            </SegmentsContent>
          </Segments>
        </View>
      </View>
    </ScrollView>
  );
}
