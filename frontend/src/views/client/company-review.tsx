import {
  Card,
  CardHeader,
  CardBody,
  Avatar,
  Button,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";
import { FaStar, FaRegStar } from "react-icons/fa";
import { MdOutlineStarRate } from "react-icons/md";

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex">
      {[...Array(5)].map((_, index) =>
        index < rating ? (
          <FaStar key={index} className="text-yellow-400" />
        ) : (
          <FaRegStar key={index} className="text-yellow-400" />
        )
      )}
    </div>
  );
};

export default function CompanyReviews({
  reviews,
  companyName,
}: {
  companyName: string;
  reviews: any[];
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button
        onPress={onOpen}
        className="mt-4 w-full bg-purple-400 text-white hover:bg-purple-500"
      >
        View Reviews
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        scrollBehavior="inside"
        size="2xl"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Customer Reviews for {companyName}
              </ModalHeader>
              <ModalBody>
                <div className="mt-8">
                  {reviews && reviews.length == 0 && (
                    <div className="flex flex-col items-center justify-center">
                      <MdOutlineStarRate size={27} />
                      No reviews for now
                    </div>
                  )}
                  {reviews.map((review: any) => (
                    <Card key={review.id} className="mb-4">
                      <CardHeader className="flex gap-3">
                        <Avatar
                          isBordered
                          radius="full"
                          size="sm"
                          className="cursor-pointer"
                          name={`${review.user?.firstname
                            .charAt(0)
                            .toUpperCase()}${review.user?.lastname
                            .charAt(0)
                            .toUpperCase()}`}
                        />
                        <div className="flex flex-col">
                          <p className="text-md">
                            {review.user?.firstname} {review.user?.lastname}
                          </p>
                          <p className="text-small text-default-500">
                            {review.createdAt.split("T")[0]}
                          </p>
                        </div>
                      </CardHeader>
                      <CardBody className="flex flex-col items-start justify-center">
                        <StarRating rating={review.rating} />

                        <p>{review.comment}</p>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
